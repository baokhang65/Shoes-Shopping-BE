/* eslint-disable no-useless-catch */
import { cartModel } from '~/models/cartModel'
import { userModel } from '~/models/userModel'
import { productModel } from '~/models/productModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const getCart = async (userId) => {
  try {
    if (userId) {
      const user = await userModel.findOneById(userId)
      if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
      }

      const invalidItems = await cleanupCart(userId)

      const cart = await cartModel.findOneByUserId(userId)

      if (cart) {
        const cartTotal = cartModel.calculateCartTotal(cart)
        return {
          ...cart,
          cartTotal,
          invalidItemsRemoved: invalidItems || []
        }
      }

      return { userId, items: [], cartTotal: 0, createdAt: new Date(), updatedAt: null }
    }

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

    const updatedCart = await cartModel.addItemToCart(userId, enrichedItemData)

    const cartTotal = cartModel.calculateCartTotal(updatedCart)

    return { ...updatedCart, cartTotal }
  } catch (error) { throw error }
}

const updateItemQuantity = async (userId, productId, size, quantity) => {
  try {
    if (!userId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'User ID is required to update cart')
    }

    const user = await userModel.findOneById(userId)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }

    if (!productId || !size) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Product ID and size are required')
    }

    if (quantity > 0) {
      const product = await productModel.findOneById(productId)
      if (!product) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
      }

      const sizeObj = product.sizes.find(s => s.size === size)
      if (!sizeObj) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Size not available for this product')
      }

      const currentCart = await cartModel.findOneByUserId(userId)
      const currentItem = currentCart?.items?.find(item =>
        item.productId === productId && item.size === size
      )
      const currentQuantity = currentItem ? currentItem.quantity : 0

      if (quantity > currentQuantity) {
        const additionalQuantity = quantity - currentQuantity
        if (sizeObj.stock < additionalQuantity) {
          throw new ApiError(
            StatusCodes.BAD_REQUEST,
            `Not enough stock. Only ${sizeObj.stock} additional items available.`
          )
        }
      }
    }

    const updatedCart = await cartModel.updateCartItemQuantity(userId, productId, size, quantity)

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

const validateCartItems = async (cart) => {
  try {
    if (!cart || !cart.items || cart.items.length === 0) return { valid: true, invalidItems: [] }

    const invalidItems = []

    for (const item of cart.items) {
      try {
        const product = await productModel.findOneById(item.productId)
        if (!product || !product.isActive) {
          invalidItems.push({
            productId: item.productId,
            size: item.size,
            reason: 'Product not found or not active'
          })
          continue
        }
        const sizeObj = product.sizes.find(s => s.size === item.size)
        if (!sizeObj) {
          invalidItems.push({
            productId: item.productId,
            size: item.size,
            reason: 'Size not available for this product'
          })
          continue
        }
        if (sizeObj.stock < item.quantity) {
          invalidItems.push({
            productId: item.productId,
            size: item.size,
            availableStock: sizeObj.stock,
            requestedQuantity: item.quantity,
            reason: `Not enough stock. Only ${sizeObj.stock} available.`
          })
        }
      } catch (err) {
        invalidItems.push({
          productId: item.productId,
          size: item.size,
          reason: 'Error validating item'
        })
      }
    }
    return {
      valid: invalidItems.length === 0,
      invalidItems
    }
  } catch (error) { throw error }
}

const cleanupCart = async (userId) => {
  try {
    if (!userId) return

    const cart = await cartModel.findOneByUserId(userId)
    if (!cart || !cart.items || cart.items.length === 0) return

    const validation = await validateCartItems(cart)
    if (validation.valid) return

    // Xóa các mục không hợp lệ khỏi giỏ hàng
    for (const invalidItem of validation.invalidItems) {
      await cartModel.removeCartItem(userId, invalidItem.productId, invalidItem.size)
    }

    return validation.invalidItems
  } catch (error) { throw error }
}

export const cartService = {
  getCart,
  addItem,
  updateItemQuantity,
  removeItem,
  clearCart,
  transferGuestCart,
  validateCartItems,
  cleanupCart
}