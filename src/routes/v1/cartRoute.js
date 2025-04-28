import express from 'express'
import { cartValidation } from '~/validations/cartValidation'
import { cartController } from '~/controllers/cartController'
import { orderController } from '~/controllers/orderController'
import { orderValidation } from '~/validations/orderValidation'

const Router = express.Router()

Router.route('/')
  .get(cartController.getCart)
  .post(cartValidation.addItem, cartController.addItem)

Router.route('/items')
  .put(cartValidation.updateItem, cartController.updateItem)
  .delete(cartValidation.removeItem, cartController.removeItem)

Router.route('/clear')
  .delete(cartController.clearCart)

Router.route('/checkout')
  .post(orderValidation.createOrder, orderController.createOrder)

export const cartRoute = Router
