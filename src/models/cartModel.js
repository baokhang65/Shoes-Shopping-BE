import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

// Define Collection (name & schema)
const CART_COLLECTION_NAME = 'carts'

const CART_COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  items: Joi.array().items(
    Joi.object({
      productId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
      color: Joi.string().required().pattern(/^\S(.*\S)?$/).strict(),
      size: Joi.number().strict().required(),
      quantity: Joi.number().integer().min(1).strict().required()
    })
  ).default([]),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now)
})

export const cartModel = {
  CART_COLLECTION_NAME,
  CART_COLLECTION_SCHEMA
}
