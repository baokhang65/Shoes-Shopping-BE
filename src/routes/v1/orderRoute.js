import express from 'express'
import { orderValidation } from '~/validations/orderValidation'
import { orderController } from '~/controllers/orderController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/')
  .get(authMiddleware.isAuthorized, orderController.getUserOrders)
  .post(authMiddleware.isAuthorized, orderValidation.createOrder, orderController.createOrder)

Router.route('/all')
  .get(orderController.getAllOrders)

Router.route('/:id')
  .get(authMiddleware.isAuthorized, orderController.getOrderDetails)
  .patch(orderValidation.updateStatus, orderController.updateOrderStatus)

export const orderRoute = Router
