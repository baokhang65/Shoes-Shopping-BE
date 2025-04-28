import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { ORDER_STATUS } from '~/utils/constants'

const createOrder = async (req, res, next) => {
  const correctCondition = Joi.object({
    userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
    shippingAddress: Joi.string().trim().required()
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

const updateStatus = async (req, res, next) => {
  const correctCondition = Joi.object({
    status: Joi.string().valid(
      ORDER_STATUS.PENDING,
      ORDER_STATUS.PROCESSING,
      ORDER_STATUS.SHIPPED,
      ORDER_STATUS.DELIVERED,
      ORDER_STATUS.CANCELLED
    ).required()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const orderValidation = {
  createOrder,
  updateStatus
}
