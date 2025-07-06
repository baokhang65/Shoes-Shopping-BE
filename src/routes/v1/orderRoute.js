import express from 'express'
import { orderValidation } from '~/validations/orderValidation'
import { orderController } from '~/controllers/orderController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/')
  .get(authMiddleware.isAuthorized, orderController.getUserOrders)
  .post(authMiddleware.isAuthorized, orderValidation.createOrder, orderController.createOrder)

Router.route('/checkout')
  .post(authMiddleware.isAuthorized, orderValidation.createOrder, orderController.createOrder)

Router.route('/all')
  .get(authMiddleware.isAuthorized, orderController.getAllOrders)

Router.route('/:id')
  .get(authMiddleware.isAuthorized, orderController.getOrderDetails)
  .patch(authMiddleware.isAuthorized, orderValidation.updateStatus, orderController.updateOrderStatus)

export const orderRoute = Router