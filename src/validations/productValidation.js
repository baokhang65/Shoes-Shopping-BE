import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().required().min(2).max(100).pattern(/^\S(.*\S)?$/).strict(),
    brand: Joi.string().required().valid('Nike', 'Adidas', 'Vans'),
    description: Joi.string().allow('', null).default(''),
    variants: Joi.array().items(
      Joi.object({
        price: Joi.number().required().strict().greater(0),
        size: Joi.number().required().strict(),
        stock: Joi.number().integer().min(0).strict().required()
      })
    ).default([])
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
