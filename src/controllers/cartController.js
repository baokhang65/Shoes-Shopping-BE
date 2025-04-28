import { StatusCodes } from 'http-status-codes'
import { cartService } from '~/services/cartService'

const getCart = async (req, res, next) => {
  try {
    const userId = req.query.userId || null // Allow guest users (null userId)
    const cart = await cartService.getCart(userId)
    res.status(StatusCodes.OK).json(cart)
  } catch (error) { next(error) }
}

const addItem = async (req, res, next) => {
  try {
    const userId = req.body.userId || null // Allow guest users
    const item = {
      productId: req.body.productId,
      size: req.body.size,
      quantity: req.body.quantity || 1
    }
    const updatedCart = await cartService.addItem(userId, item)
    res.status(StatusCodes.OK).json(updatedCart)
  } catch (error) { next(error) }
}

const updateItem = async (req, res, next) => {
  try {
    const userId = req.body.userId || null
    const { productId, size, quantity } = req.body
    const updatedCart = await cartService.updateItemQuantity(userId, productId, size, quantity)
    res.status(StatusCodes.OK).json(updatedCart)
  } catch (error) { next(error) }
}

const removeItem = async (req, res, next) => {
  try {
    const userId = req.body.userId || null
    const { productId, size } = req.body
    const updatedCart = await cartService.removeItem(userId, productId, size)
    res.status(StatusCodes.OK).json(updatedCart)
  } catch (error) { next(error) }
}

const clearCart = async (req, res, next) => {
  try {
    const userId = req.query.userId || null
    const emptyCart = await cartService.clearCart(userId)
    res.status(StatusCodes.OK).json(emptyCart)
  } catch (error) { next(error) }
}

export const cartController = {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart
}
