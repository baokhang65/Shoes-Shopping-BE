import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

// Define Collection (name & schema)
const CART_COLLECTION_NAME = 'carts'

const CART_COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  items: Joi.array().items(
    Joi.object({
      productId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
      size: Joi.string().trim().required(),
      quantity: Joi.number().integer().min(1).default(1),
      price: Joi.number().precision(2).positive().required(), // Added price field
      productName: Joi.string().required(), // Added product name for better cart display
      productImage: Joi.string().allow(null), // Added image URL
      createdAt: Joi.date().default(Date.now),
      updatedAt: Joi.date().allow(null)
    }).strict()
  ).default([]),
  createdAt: Joi.date().default(Date.now),
  updatedAt: Joi.date().allow(null)
}).strict()

const validateBeforeCreate = async (data) => {
  return await CART_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    return await GET_DB().collection(CART_COLLECTION_NAME).insertOne(validData)
  } catch (error) { throw new Error(error) }
}

const findOneByUserId = async (userId) => {
  try {
    // Convert userId to string if it's an ObjectId
    const userIdStr = userId instanceof ObjectId ? userId.toString() : userId
    const result = await GET_DB().collection(CART_COLLECTION_NAME).findOne({ userId: userIdStr })
    return result
  } catch (error) { throw new Error(error) }
}

const addItemToCart = async (userId, productData) => {
  try {
    // Get user's cart or create a new one
    let cart = await findOneByUserId(userId)
    if (!cart) {
      // Create new cart for user
      await createNew({
        userId: userId,
        items: [],
        createdAt: new Date(),
        updatedAt: null
      })
      cart = await findOneByUserId(userId)
    }

    // Check if this product with the same size already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.productId === productData.productId && item.size === productData.size
    )

    if (existingItemIndex > -1) {
      // Update quantity if item already exists
      await GET_DB().collection(CART_COLLECTION_NAME).updateOne(
        { userId, 'items.productId': productData.productId, 'items.size': productData.size },
        {
          $inc: { 'items.$.quantity': productData.quantity },
          $set: { 'items.$.updatedAt': new Date(), updatedAt: new Date() }
        }
      )
    } else {
      // Add new item to cart
      await GET_DB().collection(CART_COLLECTION_NAME).updateOne(
        { userId },
        {
          $push: { items: { ...productData, createdAt: new Date(), updatedAt: null } },
          $set: { updatedAt: new Date() }
        }
      )
    }
    // Return updated cart
    return await findOneByUserId(userId)
  } catch (error) { throw new Error(error) }
}

const updateCartItemQuantity = async (userId, productId, size, quantity) => {
  try {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      return await removeCartItem(userId, productId, size)
    }
    // Update item quantity
    await GET_DB().collection(CART_COLLECTION_NAME).updateOne(
      { userId, 'items.productId': productId, 'items.size': size },
      {
        $set: {
          'items.$.quantity': quantity,
          'items.$.updatedAt': new Date(),
          updatedAt: new Date()
        }
      }
    )
    // Return updated cart
    return await findOneByUserId(userId)
  } catch (error) { throw new Error(error) }
}

const removeCartItem = async (userId, productId, size) => {
  try {
    // Remove item from cart
    await GET_DB().collection(CART_COLLECTION_NAME).updateOne(
      { userId },
      {
        $pull: { items: { productId, size } },
        $set: { updatedAt: new Date() }
      }
    )
    // Return updated cart
    return await findOneByUserId(userId)
  } catch (error) { throw new Error(error) }
}

const clearCart = async (userId) => {
  try {
    // Clear all items from cart
    await GET_DB().collection(CART_COLLECTION_NAME).updateOne(
      { userId },
      {
        $set: {
          items: [],
          updatedAt: new Date()
        }
      }
    )
    // Return updated cart
    return await findOneByUserId(userId)
  } catch (error) { throw new Error(error) }
}

// Calculate cart total
const calculateCartTotal = (cart) => {
  if (!cart || !cart.items || cart.items.length === 0) {
    return 0
  }

  return cart.items.reduce((total, item) => {
    return total + (item.price * item.quantity)
  }, 0)
}

// Create temporary cart for guest users
const createGuestCart = () => {
  return {
    items: [],
    createdAt: new Date(),
    updatedAt: null
  }
}

// Transfer guest cart to user cart after login/registration
const transferGuestCart = async (userId, guestCartItems) => {
  try {
    if (!guestCartItems || guestCartItems.length === 0) {
      return await findOneByUserId(userId)
    }

    // Get or create user cart
    let cart = await findOneByUserId(userId)
    if (!cart) {
      await createNew({
        userId,
        items: [],
        createdAt: new Date(),
        updatedAt: null
      })
      cart = await findOneByUserId(userId)
    }

    // Add each guest cart item to the user's cart
    for (const item of guestCartItems) {
      await addItemToCart(userId, item)
    }

    return await findOneByUserId(userId)
  } catch (error) { throw new Error(error) }
}

export const cartModel = {
  CART_COLLECTION_NAME,
  CART_COLLECTION_SCHEMA,
  createNew,
  findOneByUserId,
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  calculateCartTotal,
  createGuestCart,
  transferGuestCart
}