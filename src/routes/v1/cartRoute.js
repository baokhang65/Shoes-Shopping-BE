import express from 'express'
import { cartValidation } from '~/validations/cartValidation'
import { cartController } from '~/controllers/cartController'

const Router = express.Router()

Router.route('/')
  .get(cartController.getCart)
  .post(cartValidation.addItem, cartController.addItem)

Router.route('/items')
  .put(cartValidation.updateItem, cartController.updateItem)
  .delete(cartValidation.removeItem, cartController.removeItem)

Router.route('/clear')
  .delete(cartController.clearCart)

export const cartRoute = Router
