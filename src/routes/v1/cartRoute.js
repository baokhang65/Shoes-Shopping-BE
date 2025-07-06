import express from 'express'
import { cartValidation } from '~/validations/cartValidation'
import { cartController } from '~/controllers/cartController'
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

export const cartRoute = Router