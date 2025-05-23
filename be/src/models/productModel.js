import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { PRODUCT_BRANDS } from '~/utils/constants'

// Define Collection (name & schema)
const PRODUCT_COLLECTION_NAME = 'products'

const PRODUCT_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().min(2).max(100).trim().required(),
  slug: Joi.string().min(2).trim().required(),
  brand: Joi.string().valid(PRODUCT_BRANDS.NIKE, PRODUCT_BRANDS.ADIDAS, PRODUCT_BRANDS.VANS).required(),
  description: Joi.string().trim().required(),
  price: Joi.number().precision(2).positive().required(),
  image: Joi.string().trim().uri().allow(null, ''),
  sizes: Joi.array().items(
    Joi.object({
      size: Joi.string().trim().required(),
      stock: Joi.number().integer().min(0).default(0)
    }).strict()
  ).required(),
  isActive: Joi.boolean().default(true),
  createdAt: Joi.date().default(Date.now),
  updatedAt: Joi.date().allow(null)
}).strict()

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
    const result = await findOneById(id)
    if (!result) {
      throw new Error('Product not found')
    }
    return result
  } catch (error) { throw new Error(error) }
}

const getAllProducts = async ({ page = 1, limit = 12, sort = { createdAt: -1 } }) => {
  try {
    const skip = (page - 1) * limit
    const results = await GET_DB().collection(PRODUCT_COLLECTION_NAME)
      .find({ isActive: true })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray()
    const totalCount = await GET_DB().collection(PRODUCT_COLLECTION_NAME).countDocuments({ isActive: true })
    return {
      products: results,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        limit
      }
    }
  } catch (error) { throw new Error(error) }
}

const getProductsByBrand = async (brand, { page = 1, limit = 12, sort = { createdAt: -1 } }) => {
  try {
    const skip = (page - 1) * limit
    const results = await GET_DB().collection(PRODUCT_COLLECTION_NAME)
      .find({ brand, isActive: true })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray()
    const totalCount = await GET_DB().collection(PRODUCT_COLLECTION_NAME).countDocuments({
      brand,
      isActive: true
    })
    return {
      products: results,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        limit
      }
    }
  } catch (error) { throw new Error(error) }
}

const getProductsByPriceSort = async (sortDirection, { page = 1, limit = 12 }) => {
  try {
    const skip = (page - 1) * limit
    const sort = { price: sortDirection === 'asc' ? 1 : -1 }
    const results = await GET_DB().collection(PRODUCT_COLLECTION_NAME)
      .find({ isActive: true })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray()
    const totalCount = await GET_DB().collection(PRODUCT_COLLECTION_NAME).countDocuments({ isActive: true })
    return {
      products: results,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        limit
      }
    }
  } catch (error) { throw new Error(error) }
}

const searchProducts = async (keyword, { page = 1, limit = 12, sort = { createdAt: -1 } }) => {
  try {
    if (!keyword || keyword.trim() === '') {
      return {
        products: [],
        pagination: {
          totalCount: 0,
          totalPages: 0,
          currentPage: page,
          limit
        }
      }
    }

    const skip = (page - 1) * limit
    const searchPattern = new RegExp(keyword.trim(), 'i')
    const query = {
      $and: [
        { isActive: true },
        {
          $or: [
            { name: searchPattern },
            { description: searchPattern },
            { brand: searchPattern }
          ]
        }
      ]
    }
    const results = await GET_DB().collection(PRODUCT_COLLECTION_NAME)
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray()
    const totalCount = await GET_DB().collection(PRODUCT_COLLECTION_NAME).countDocuments(query)
    return {
      products: results,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        limit
      }
    }
  } catch (error) { throw new Error(error) }
}

const updateProduct = async (id, updateData) => {
  try {
    delete updateData._id
    updateData.updatedAt = new Date()
    const result = await GET_DB().collection(PRODUCT_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(String(id)) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) { throw new Error(error) }
}
const deleteProduct = async (id) => {
  try {
    const result = await GET_DB().collection(PRODUCT_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(String(id)) },
      {
        $set: {
          isActive: false,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) { throw new Error(error) }
}

const checkStockAvailability = async (productId, size, quantity) => {
  try {
    const product = await findOneById(productId)
    if (!product) {
      return { available: false, message: 'Product not found' }
    }
    const sizeObj = product.sizes.find(s => s.size === size)
    if (!sizeObj) {
      return { available: false, message: 'Size not available' }
    }
    if (sizeObj.stock < quantity) {
      return {
        available: false,
        message: `Not enough stock. Only ${sizeObj.stock} available.`,
        availableStock: sizeObj.stock
      }
    }
    return { available: true }
  } catch (error) { throw new Error(error) }
}

export const productModel = {
  PRODUCT_COLLECTION_NAME,
  PRODUCT_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getDetails,
  getAllProducts,
  getProductsByBrand,
  getProductsByPriceSort,
  searchProducts,
  updateProduct,
  deleteProduct,
  checkStockAvailability
}
