/* eslint-disable no-useless-catch */
import { orderModel } from '~/models/orderModel'
import { userModel } from '~/models/userModel'
import { cartModel } from '~/models/cartModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { USER_ROLES } from '~/utils/constants'

const getUserOrders = async (userId) => {
  try {
    if (!userId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'User ID is required to fetch orders')
    }

    // Check if user exists
    const user = await userModel.findOneById(userId)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }

    // Check if user has permission to view orders (must be at least a CUSTOMER)
    if (user.role === USER_ROLES.GUEST) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You need to complete an order to view order history')
    }

    const orders = await orderModel.findByUserId(userId)
    return orders
  } catch (error) { throw error }
}

const getOrderDetails = async (orderId, userId = null) => {
  try {
    if (!orderId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Order ID is required')
    }

    const order = await orderModel.findOneById(orderId)
    if (!order) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found')
    }

    // If userId is provided, verify that the order belongs to this user
    // This prevents users from accessing orders that aren't theirs
    if (userId && order.userId !== userId) {
      // Check if the user is an admin (admins can view any order)
      const user = await userModel.findOneById(userId)
      if (!user || user.role !== USER_ROLES.ADMIN) {
        throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to view this order')
      }
    }

    return order
  } catch (error) { throw error }
}

const createOrderFromCart = async (userId, orderData) => {
  try {
    if (!userId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'User ID is required to create an order')
    }

    // Check if user exists
    const user = await userModel.findOneById(userId)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }

    if (!orderData.shippingAddress) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Shipping address is required')
    }

    // Get user's cart and check if it has items
    const cart = await cartModel.findOneByUserId(userId)
    if (!cart || !cart.items || cart.items.length === 0) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Cannot create order from an empty cart')
    }

    // Calculate total from cart items to ensure accuracy
    const totalAmount = cartModel.calculateCartTotal(cart)
    if (totalAmount <= 0) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Order total must be greater than zero')
    }

    // Create order data
    const newOrderData = {
      userId,
      totalAmount,
      shippingAddress: orderData.shippingAddress,
      items: cart.items,
      createdAt: new Date(),
      updatedAt: null
    }

    // Create order from cart
    const result = await orderModel.createNew(newOrderData)
    if (!result || !result.acknowledged) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to create order')
    }

    // If guest user, upgrade to customer after successful order
    if (user.role === USER_ROLES.GUEST) {
      await userModel.updateRole(userId, USER_ROLES.CUSTOMER)
    }

    // Get the newly created order
    const newOrder = await orderModel.findOneById(result.insertedId)
    return newOrder
  } catch (error) {
    // Handle specific errors
    if (error.message === 'Cart is empty') {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Cannot create order from an empty cart')
    }
    throw error
  }
}

const updateOrderStatus = async (orderId, status, userId = null) => {
  try {
    if (!orderId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Order ID is required')
    }
    if (!status) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Status is required')
    }

    // If userId is provided, check permissions
    if (userId) {
      const user = await userModel.findOneById(userId)
      // Only admin can update order status
      if (!user || user.role !== USER_ROLES.ADMIN) {
        throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to update order status')
      }
    }

    // Update order status
    const updatedOrder = await orderModel.updateOrderStatus(orderId, status)
    return updatedOrder
  } catch (error) {
    // Handle specific errors
    if (error.message === 'Invalid order status') {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid order status')
    }
    if (error.message === 'Order not found') {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found')
    }
    throw error
  }
}

const getAllOrders = async (options, userId = null) => {
  try {
    // Check if user has admin permissions
    if (userId) {
      const user = await userModel.findOneById(userId)
      if (!user || user.role !== USER_ROLES.ADMIN) {
        throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to view all orders')
      }
    }

    const result = await orderModel.getAllOrders(options)
    return result
  } catch (error) { throw error }
}

export const orderService = {
  getUserOrders,
  getOrderDetails,
  createOrderFromCart,
  updateOrderStatus,
  getAllOrders
}