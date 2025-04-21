/**
 * Updated by trungquandev.com's student
 * "A great product starts with a clean structure."
 */

import Joi from 'joi'

// Define Collection (name & schema)
const PRODUCT_COLLECTION_NAME = 'products'

const PRODUCT_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().required().min(2).max(100).pattern(/^\S(.*\S)?$/).strict(),
  brand: Joi.string().required().valid('Nike', 'Adidas', 'Vans'),
  description: Joi.string().allow('', null).default(''),
  price: Joi.number().required().strict().greater(0),
  images: Joi.array().items(Joi.string().uri()).default([]),
  variants: Joi.array().items(
    Joi.object({
      color: Joi.string().required().pattern(/^\S(.*\S)?$/).strict(),
      size: Joi.number().required().strict(),
      stock: Joi.number().integer().min(0).strict().required()
    })
  ).default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

export const productModel = {
  PRODUCT_COLLECTION_NAME,
  PRODUCT_COLLECTION_SCHEMA
}
