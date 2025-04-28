/* eslint-disable no-useless-catch */
import { cartModel } from '~/models/cartModel'
import { userModel } from '~/models/userModel'
import { productModel } from '~/models/productModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const getCart = async (userId) => {
  try {
    // If userId is provided, get their cart
    if (userId) {
      // Verify user exists
      const user = await userModel.findOneById(userId)
      if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
      }

      const cart = await cartModel.findOneByUserId(userId)

      if (cart) {
        // Calculate cart total
        const cartTotal = cartModel.calculateCartTotal(cart)
        return { ...cart, cartTotal }
      }

      return { userId, items: [], cartTotal: 0, createdAt: new Date(), updatedAt: null }
    }

    // For guest users (no userId), return empty cart structure
    return { items: [], cartTotal: 0, createdAt: new Date(), updatedAt: null }
  } catch (error) { throw error }
}

const addItem = async (userId, itemData) => {
  try {
    // For guest users, we could implement a cart in session or cookies
    // For this implementation, we'll require a userId
    if (!userId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'User ID is required to add items to cart')
    }

    // Verify user exists
    const user = await userModel.findOneById(userId)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }

    // Validate item data has required fields
    if (!itemData.productId || !itemData.size) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Product ID and size are required')
    }

    // Make sure quantity is at least 1
    const quantity = itemData.quantity && itemData.quantity > 0 ? itemData.quantity : 1

    // Get product details to add to cart
    const product = await productModel.findOneById(itemData.productId)
    if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
    }

    // Check if product is active
    if (!product.isActive) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Product is not available')
    }

    // Check stock availability
    const sizeObj = product.sizes.find(s => s.size === itemData.size)
    if (!sizeObj) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Size not available for this product')
    }

    if (sizeObj.stock < quantity) {
      throw new ApiError(StatusCodes.BAD_REQUEST, `Not enough stock. Only ${sizeObj.stock} available.`)
    }

    // Add product details to item data
    const enrichedItemData = {
      ...itemData,
      quantity,
      price: product.price,
      productName: product.name,
      productImage: product.image || null
    }

    // Add the item to the cart
    const updatedCart = await cartModel.addItemToCart(userId, enrichedItemData)

    // Calculate cart total
    const cartTotal = cartModel.calculateCartTotal(updatedCart)

    return { ...updatedCart, cartTotal }
  } catch (error) { throw error }
}

const updateItemQuantity = async (userId, productId, size, quantity) => {
  try {
    if (!userId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'User ID is required to update cart')
    }

    // Verify user exists
    const user = await userModel.findOneById(userId)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }

    if (!productId || !size) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Product ID and size are required')
    }

    // If quantity > 0, check stock availability
    if (quantity > 0) {
      const product = await productModel.findOneById(productId)
      if (!product) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
      }

      const sizeObj = product.sizes.find(s => s.size === size)
      if (!sizeObj) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Size not available for this product')
      }

      if (sizeObj.stock < quantity) {
        throw new ApiError(StatusCodes.BAD_REQUEST, `Not enough stock. Only ${sizeObj.stock} available.`)
      }
    }

    const updatedCart = await cartModel.updateCartItemQuantity(userId, productId, size, quantity)

    // Calculate cart total
    const cartTotal = cartModel.calculateCartTotal(updatedCart)

    return { ...updatedCart, cartTotal }
  } catch (error) { throw error }
}

const removeItem = async (userId, productId, size) => {
  try {
    if (!userId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'User ID is required to remove items from cart')
    }

    // Verify user exists
    const user = await userModel.findOneById(userId)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }

    if (!productId || !size) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Product ID and size are required')
    }

    const updatedCart = await cartModel.removeCartItem(userId, productId, size)

    // Calculate cart total
    const cartTotal = cartModel.calculateCartTotal(updatedCart)

    return { ...updatedCart, cartTotal }
  } catch (error) { throw error }
}

const clearCart = async (userId) => {
  try {
    if (!userId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'User ID is required to clear cart')
    }

    // Verify user exists
    const user = await userModel.findOneById(userId)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }

    const emptyCart = await cartModel.clearCart(userId)
    return { ...emptyCart, cartTotal: 0 }
  } catch (error) { throw error }
}

// Transfer guest cart to user cart after login/registration
const transferGuestCart = async (userId, guestCartItems) => {
  try {
    if (!userId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'User ID is required')
    }

    // Verify user exists
    const user = await userModel.findOneById(userId)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }

    if (!guestCartItems || !Array.isArray(guestCartItems) || guestCartItems.length === 0) {
      // If no guest cart, just return the user's cart
      return await getCart(userId)
    }

    // Process each item in the guest cart
    for (const item of guestCartItems) {
      try {
        // Validate and get current product details
        const product = await productModel.findOneById(item.productId)
        if (product && product.isActive) {
          const sizeObj = product.sizes.find(s => s.size === item.size)
          if (sizeObj && sizeObj.stock >= item.quantity) {
            // Add item to user's cart with current price and details
            await addItem(userId, {
              productId: item.productId,
              size: item.size,
              quantity: item.quantity
            })
          }
        }
      } catch (err) {
        // Skip items that can't be added (don't fail the whole operation)
        // eslint-disable-next-line no-console
        console.error(`Failed to add item ${item.productId} to cart: ${err.message}`)
      }
    }

    // Return the updated cart
    return await getCart(userId)
  } catch (error) { throw error }
}

export const cartService = {
  getCart,
  addItem,
  updateItemQuantity,
  removeItem,
  clearCart,
  transferGuestCart
}