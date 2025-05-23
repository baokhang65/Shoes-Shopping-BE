import { StatusCodes } from 'http-status-codes'
import { cartService } from '~/services/cartService'

const getCart = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded?._id || req.query.userId || null
    const cart = await cartService.getCart(userId)
    res.status(StatusCodes.OK).json(cart)
  } catch (error) { next(error) }
}

const addItem = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded?._id || req.body.userId || null
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
    const userId = req.jwtDecoded?._id || req.body.userId || null
    const { productId, size, quantity } = req.body
    const updatedCart = await cartService.updateItemQuantity(userId, productId, size, quantity)
    res.status(StatusCodes.OK).json(updatedCart)
  } catch (error) { next(error) }
}

const removeItem = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded?._id || req.body.userId || null
    const { productId, size } = req.body
    const updatedCart = await cartService.removeItem(userId, productId, size)
    res.status(StatusCodes.OK).json(updatedCart)
  } catch (error) { next(error) }
}

const clearCart = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded?._id || req.query.userId || null
    const emptyCart = await cartService.clearCart(userId)
    res.status(StatusCodes.OK).json(emptyCart)
  } catch (error) { next(error) }
}

const transferGuestCart = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded?._id || req.body.userId
    const { guestCartItems } = req.body

    if (!userId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'User ID is required'
      })
    }

    if (!guestCartItems || !Array.isArray(guestCartItems)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Guest cart items must be an array'
      })
    }

    const userCart = await cartService.transferGuestCart(userId, guestCartItems)
    res.status(StatusCodes.OK).json(userCart)
  } catch (error) { next(error) }
}

export const cartController = {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
  transferGuestCart
}