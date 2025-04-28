/* eslint-disable no-useless-catch */
import { cartModel } from '~/models/cartModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const getCart = async (userId) => {
  try {
    // If userId is provided, get their cart
    if (userId) {
      const cart = await cartModel.findOneByUserId(userId)
      return cart || { userId, items: [], createdAt: new Date(), updatedAt: null }
    }
    // For guest users (no userId), return empty cart structure
    return { items: [], createdAt: new Date(), updatedAt: null }
  } catch (error) { throw error }
}

const addItem = async (userId, itemData) => {
  try {
    // For guest users, we could implement a cart in session or cookies
    // For this implementation, we'll require a userId
    if (!userId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'User ID is required to add items to cart')
    }

    // Validate item data has required fields
    if (!itemData.productId || !itemData.size) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Product ID and size are required')
    }

    // Make sure quantity is at least 1
    const quantity = itemData.quantity && itemData.quantity > 0 ? itemData.quantity : 1

    // Add the item to the cart
    const updatedCart = await cartModel.addItemToCart(userId, {
      ...itemData,
      quantity
    })

    return updatedCart
  } catch (error) { throw error }
}

const updateItemQuantity = async (userId, productId, size, quantity) => {
  try {
    if (!userId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'User ID is required to update cart')
    }

    if (!productId || !size) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Product ID and size are required')
    }

    const updatedCart = await cartModel.updateCartItemQuantity(userId, productId, size, quantity)
    return updatedCart
  } catch (error) { throw error }
}

const removeItem = async (userId, productId, size) => {
  try {
    if (!userId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'User ID is required to remove items from cart')
    }

    if (!productId || !size) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Product ID and size are required')
    }

    const updatedCart = await cartModel.removeCartItem(userId, productId, size)
    return updatedCart
  } catch (error) { throw error }
}

const clearCart = async (userId) => {
  try {
    if (!userId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'User ID is required to clear cart')
    }

    const emptyCart = await cartModel.clearCart(userId)
    return emptyCart
  } catch (error) { throw error }
}

export const cartService = {
  getCart,
  addItem,
  updateItemQuantity, 
  removeItem,
  clearCart
}
