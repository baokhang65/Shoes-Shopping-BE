/* eslint-disable no-useless-catch */
import { orderModel } from '~/models/orderModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const getUserOrders = async (userId) => {
  try {
    if (!userId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'User ID is required to fetch orders')
    }
    const orders = await orderModel.findByUserId(userId)
    return orders
  } catch (error) { throw error }
}

const getOrderDetails = async (orderId) => {
  try {
    if (!orderId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Order ID is required')
    }
    const order = await orderModel.findOneById(orderId)
    if (!order) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found')
    }
    return order
  } catch (error) { throw error }
}

const createOrderFromCart = async (userId, orderData) => {
  try {
    if (!userId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'User ID is required to create an order')
    }
    if (!orderData.shippingAddress) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Shipping address is required')
    }
    // Create order from cart
    const result = await orderModel.createFromCart(userId, orderData)
    if (!result || !result.acknowledged) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to create order')
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

const updateOrderStatus = async (orderId, status) => {
  try {
    if (!orderId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Order ID is required')
    }
    if (!status) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Status is required')
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

const getAllOrders = async (options) => {
  try {
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
