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
    sizes: Joi.array().items(
      Joi.object({
        size: Joi.string().trim().required(),
        stock: Joi.number().integer().min(0).default(0)
      }).strict()
    ).required()
  })

  try {
    //Set aborEarly: false to case with have many validation then res all errors
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    //When data validation done, next to Controller
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const productValidation = {
  createNew
}
