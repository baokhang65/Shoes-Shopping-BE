import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

// Define Collection (name & schema)
const ORDER_COLLECTION_NAME = 'orders'

const ORDER_COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  status: Joi.string().valid('pending', 'paid', 'shipped', 'delivered', 'cancelled').default('pending'),
  totalPrice: Joi.number().strict().min(0).required(),
  shippingInfo: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    phone: Joi.string().pattern(/^[0-9]{9,11}$/).required(),
    address: Joi.string().min(5).max(100).required()
  }).required(),
  items: Joi.array().items(
    Joi.object({
      productId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
      name: Joi.string().required(),
      color: Joi.string().required(),
      size: Joi.number().strict().required(),
      unitPrice: Joi.number().strict().min(0).required(),
      quantity: Joi.number().integer().min(1).strict().required()
    })
  ).default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now)
})

export const orderModel = {
  ORDER_COLLECTION_NAME,
  ORDER_COLLECTION_SCHEMA
}
