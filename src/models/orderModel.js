import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { cartModel } from './cartModel'
import { userModel } from './userModel'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { ORDER_STATUS, USER_ROLES } from '~/utils/constants'

// Define Collection (name & schema)
const ORDER_COLLECTION_NAME = 'orders'

const ORDER_COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  status: Joi.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled').default('pending'),
  totalAmount: Joi.number().precision(2).positive().required(),
  shippingAddress: Joi.string().trim().required(),
  items: Joi.array().items(
    Joi.object({
      productId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
      size: Joi.string().trim().required(),
      quantity: Joi.number().integer().min(1).required(),
      price: Joi.number().precision(2).positive().required(),
      createdAt: Joi.date().default(Date.now)
    }).strict()
  ).required(),
  createdAt: Joi.date().default(Date.now),
  updatedAt: Joi.date().allow(null)
}).strict()

const validateBeforeCreate = async (data) => {
  return await ORDER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const result = await GET_DB().collection(ORDER_COLLECTION_NAME).insertOne(validData)
    // Clear the user's cart after creating an order
    if (result.acknowledged) {
      await cartModel.clearCart(validData.userId)

      // Upgrade user role from GUEST to CUSTOMER if needed
      const user = await userModel.findOneById(validData.userId)
      if (user && user.role === USER_ROLES.GUEST) {
        await userModel.updateRole(user._id.toString(), USER_ROLES.CUSTOMER)
      }
    }
    return result
  } catch (error) { throw new Error(error) }
}

const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(ORDER_COLLECTION_NAME).findOne({ _id: new ObjectId(String(id)) })
    return result
  } catch (error) { throw new Error(error) }
}

const findByUserId = async (userId) => {
  try {
    const result = await GET_DB().collection(ORDER_COLLECTION_NAME)
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray()
    return result
  } catch (error) { throw new Error(error) }
}

const updateOrderStatus = async (id, status) => {
  try {
    // Validate status
    if (!Object.values(ORDER_STATUS).includes(status)) {
      throw new Error('Invalid order status')
    }
    const result = await GET_DB().collection(ORDER_COLLECTION_NAME).updateOne(
      { _id: new ObjectId(String(id)) },
      {
        $set: {
          status,
          updatedAt: new Date()
        }
      }
    )
    if (result.matchedCount === 0) {
      throw new Error('Order not found')
    }
    return await findOneById(id)
  } catch (error) { throw new Error(error) }
}

// For admin: Get all orders with optional filtering
const getAllOrders = async ({ page = 1, limit = 10, status, sortBy = 'createdAt', sortOrder = -1 }) => {
  try {
    const skip = (page - 1) * limit
    // Build query
    const query = {}
    if (status) {
      query.status = status
    }
    // Build sort
    const sort = {}
    sort[sortBy] = sortOrder
    const results = await GET_DB().collection(ORDER_COLLECTION_NAME)
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray()
    // Get total count for pagination
    const totalCount = await GET_DB().collection(ORDER_COLLECTION_NAME).countDocuments(query)
    return {
      orders: results,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        limit
      }
    }
  } catch (error) { throw new Error(error) }
}

// Create order from user's cart
const createFromCart = async (userId, orderData) => {
  try {
    // Get user's cart
    const cart = await cartModel.findOneByUserId(userId)
    if (!cart || cart.items.length === 0) {
      throw new Error('Cart is empty')
    }
    // Calculate total amount
    const totalAmount = cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0)
    // Create order data
    const newOrderData = {
      userId,
      status: ORDER_STATUS.PENDING,
      totalAmount,
      shippingAddress: orderData.shippingAddress,
      items: cart.items,
      createdAt: new Date(),
      updatedAt: null
    }
    // Create order
    return await createNew(newOrderData)
  } catch (error) { throw new Error(error) }
}

export const orderModel = {
  ORDER_COLLECTION_NAME,
  ORDER_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  findByUserId,
  updateOrderStatus,
  getAllOrders,
  createFromCart
}