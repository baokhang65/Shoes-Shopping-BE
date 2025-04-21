import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().trim().required(),
    price: Joi.number().required().greater(0).strict(),
    // brand: Joi.string().trim().valid('Nike', 'Adidas', 'Vans').required(),
    // variants: Joi.array().items(
    //   Joi.object({
    //     color: Joi.string().trim().required(),
    //     size: Joi.number().strict().required(),
    //     stock: Joi.number().strict().integer().min(0).required()
    //   })
    // ).required()
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
