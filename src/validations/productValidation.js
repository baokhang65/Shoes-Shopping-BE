import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { PRODUCT_BRANDS } from '~/utils/constants'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().min(2).max(100).trim().required(),
    brand: Joi.string().valid(PRODUCT_BRANDS.NIKE, PRODUCT_BRANDS.ADIDAS, PRODUCT_BRANDS.VANS).required(),
    description: Joi.string().trim().required(),
    price: Joi.number().precision(2).positive().required(),
    featured: Joi.boolean().default(false),
    sizes: Joi.array().items(
      Joi.object({
        size: Joi.string().trim().required(),
        stock: Joi.number().integer().min(0).default(0)
      }).strict()
    ).required()
  })

  try {
    // Set abortEarly: false to get all validation errors at once
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    // When data validation done, next to Controller
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const update = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().min(2).max(100).trim(),
    brand: Joi.string().valid(PRODUCT_BRANDS.NIKE, PRODUCT_BRANDS.ADIDAS, PRODUCT_BRANDS.VANS),
    description: Joi.string().trim(),
    price: Joi.number().precision(2).positive(),
    featured: Joi.boolean(),
    sizes: Joi.array().items(
      Joi.object({
        size: Joi.string().trim().required(),
        stock: Joi.number().integer().min(0).default(0)
      }).strict()
    )
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const updateStock = async (req, res, next) => {
  const correctCondition = Joi.object({
    sizes: Joi.array().items(
      Joi.object({
        size: Joi.string().trim().required(),
        stock: Joi.number().integer().min(0).required()
      }).strict()
    ).required()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const productValidation = {
  createNew,
  update,
  updateStock
}
