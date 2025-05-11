import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { USER_ROLES } from '~/utils/constants'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE } from '~/utils/validators'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE).required(),
    password: Joi.string().min(8).pattern(PASSWORD_RULE).message(PASSWORD_RULE_MESSAGE).required(),
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

const verifyAccount = async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
    token: Joi.string().required()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const login = async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
    password: Joi.string().pattern(PASSWORD_RULE).message(PASSWORD_RULE_MESSAGE).required()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const update = async (req, res, next) => {
  const correctCondition = Joi.object({
    displayName: Joi.string().trim().strict(),
    current_password: Joi.string().pattern(PASSWORD_RULE).message(`currnt password: ${PASSWORD_RULE_MESSAGE}`),
    new_password: Joi.string().pattern(PASSWORD_RULE).message(`new password: ${PASSWORD_RULE_MESSAGE}`)
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

// const updateProfile = async (req, res, next) => {
//   const correctCondition = Joi.object({
//     displayName: Joi.string().trim(),
//     avatar: Joi.string().trim()
//   })

//   try {
//     await correctCondition.validateAsync(req.body, { abortEarly: false })
//     next()
//   } catch (error) {
//     next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
//   }
// }

// const updateUserRole = async (req, res, next) => {
//   const correctCondition = Joi.object({
//     role: Joi.string().valid(
//       USER_ROLES.GUEST,
//       USER_ROLES.CUSTOMER,
//       USER_ROLES.ADMIN
//     ).required()
//   })

//   try {
//     await correctCondition.validateAsync(req.body, { abortEarly: false })
//     next()
//   } catch (error) {
//     next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
//   }
// }

export const userValidation = {
  createNew,
  login,
  verifyAccount,
  update
  // updateProfile,
  // updateUserRole
}