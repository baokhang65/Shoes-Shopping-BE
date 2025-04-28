import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { USER_ROLES } from '~/utils/constants'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    username: Joi.string().trim().required(),
    displayName: Joi.string().trim(),
    role: Joi.string().valid(
      USER_ROLES.GUEST,
      USER_ROLES.CUSTOMER,
      USER_ROLES.ADMIN
    )
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

const login = async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const updateProfile = async (req, res, next) => {
  const correctCondition = Joi.object({
    displayName: Joi.string().trim(),
    avatar: Joi.string().trim()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const updateUserRole = async (req, res, next) => {
  const correctCondition = Joi.object({
    role: Joi.string().valid(
      USER_ROLES.GUEST,
      USER_ROLES.CUSTOMER,
      USER_ROLES.ADMIN
    ).required()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const userValidation = {
  createNew,
  login,
  updateProfile,
  updateUserRole
}