import { StatusCodes } from 'http-status-codes'
import { orderService } from '~/services/orderService'

const getUserOrders = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded?._id || req.query.userId
    if (!userId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'User ID is required'
      })
    }
    const orders = await orderService.getUserOrders(userId)
    res.status(StatusCodes.OK).json(orders)
  } catch (error) { next(error) }
}

const getOrderDetails = async (req, res, next) => {
  try {
    const orderId = req.params.id
    const userId = req.jwtDecoded?._id || req.query.userId

    const order = await orderService.getOrderDetails(orderId, userId)
    res.status(StatusCodes.OK).json(order)
  } catch (error) { next(error) }
}

const createOrder = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded?._id || req.body.userId
    const { shippingAddress } = req.body

    if (!userId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'User ID is required'
      })
    }

    if (!shippingAddress) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Shipping address is required'
      })
    }

    const newOrder = await orderService.createOrderFromCart(userId, { shippingAddress })
    res.status(StatusCodes.CREATED).json(newOrder)
  } catch (error) { next(error) }
}

const updateOrderStatus = async (req, res, next) => {
  try {
    const orderId = req.params.id
    const { status } = req.body
    const userId = req.jwtDecoded?._id || req.query.userId

    const updatedOrder = await orderService.updateOrderStatus(orderId, status, userId)
    res.status(StatusCodes.OK).json(updatedOrder)
  } catch (error) { next(error) }
}

const getAllOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const status = req.query.status || null
    const sortBy = req.query.sortBy || 'createdAt'
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1
    const userId = req.jwtDecoded?._id || req.query.userId

    const result = await orderService.getAllOrders({
      page,
      limit,
      status,
      sortBy,
      sortOrder
    }, userId)

    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

export const orderController = {
  getUserOrders,
  getOrderDetails,
  createOrder,
  updateOrderStatus,
  getAllOrders
}