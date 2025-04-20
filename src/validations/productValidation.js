import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().trim().required(),
    price: Joi.number().required().greater(0).strict(),
    brand: Joi.string().trim().valid('Nike', 'Adidas', 'Vans').required(),
    variants: Joi.array().items(
      Joi.object({
        color: Joi.string().trim().required(),
        size: Joi.number().trim().required(),
        stock: Joi.number().strict().integer().min(0).required()
      })
    ).required()
  })

  try {
    // console.log('req.body:', req.body)
    //Set aborEarly: false to case with have many validation then res all errors
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    // next()
    res.status(StatusCodes.CREATED).json({ message: 'POST from Validation: APIs create list products.' })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      errors: new Error(error).message
    })
  }
}

export const productValidation = {
  createNew
}
