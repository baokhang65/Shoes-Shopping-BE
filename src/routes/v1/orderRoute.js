import express from 'express'
import { orderValidation } from '~/validations/orderValidation'
import { orderController } from '~/controllers/orderController'

const Router = express.Router()

Router.route('/')
  .get(orderController.getUserOrders)
  .post(orderValidation.createOrder, orderController.createOrder)

Router.route('/all')
  .get(orderController.getAllOrders)

Router.route('/:id')
  .get(orderController.getOrderDetails)
  .patch(orderValidation.updateStatus, orderController.updateOrderStatus)

export const orderRoute = Router
