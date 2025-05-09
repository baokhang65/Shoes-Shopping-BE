import express from 'express'
import { cartValidation } from '~/validations/cartValidation'
import { cartController } from '~/controllers/cartController'
import { orderValidation } from '~/validations/orderValidation'
import { orderController } from '~/controllers/orderController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/')
  .get(authMiddleware.isAuthorized, cartController.getCart)
  .post(authMiddleware.isAuthorized, cartValidation.addItem, cartController.addItem)

Router.route('/items')
  .put(authMiddleware.isAuthorized, cartValidation.updateItem, cartController.updateItem)
  .delete(authMiddleware.isAuthorized, cartValidation.removeItem, cartController.removeItem)

Router.route('/clear')
  .delete(authMiddleware.isAuthorized, cartController.clearCart)

Router.route('/transfer')
  .post(authMiddleware.isAuthorized, cartController.transferGuestCart)

Router.route('/checkout')
  .post(authMiddleware.isAuthorized, orderValidation.createOrder, orderController.createOrder)

export const cartRoute = Router