import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'

// Define Collection (name & schema)
const PRODUCT_COLLECTION_NAME = 'products'

const PRODUCT_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().required().min(2).max(100).pattern(/^\S(.*\S)?$/).strict(),
  slug: Joi.string().required().min(2).pattern(/^\S(.*\S)?$/).strict(),
  brand: Joi.string().required().valid('Nike', 'Adidas', 'Vans'),
  description: Joi.string().allow('', null).default(''),
  images: Joi.array().items(Joi.string().uri()).default([]),
  variants: Joi.array().items(
    Joi.object({
      price: Joi.number().required().strict().greater(0),
      size: Joi.number().required().strict(),
      stock: Joi.number().integer().min(0).strict().required()
    })
  ).default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
  return await PRODUCT_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)

    return await GET_DB().collection(PRODUCT_COLLECTION_NAME).insertOne(validData)
  } catch (error) { throw new Error(error) }
}

const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(PRODUCT_COLLECTION_NAME).findOne({ _id:  new ObjectId(String(id)) })
    return result
  } catch (error) { throw new Error(error) }
}

const getDetails = async (id) => {
  try {
    // Update aggregate later
    const result = await GET_DB().collection(PRODUCT_COLLECTION_NAME).findOne({ _id:  new ObjectId(String(id)) })
    return result
  } catch (error) { throw new Error(error) }
}

export const productModel = {
  PRODUCT_COLLECTION_NAME,
  PRODUCT_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getDetails
}
