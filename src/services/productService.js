/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'
import { productModel } from '~/models/productModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const createNew = async (reqBody) => {
  try {
    const newProduct = {
      ...reqBody,
      slug: slugify(reqBody.name)
    }

    const createProduct = await productModel.createNew(newProduct)

    const getNewProduct = await productModel.findOneById(createProduct.insertedId)

    return getNewProduct
  } catch (error) { throw error }
}

const getDetails = async (productId) => {
  try {
    const product = await productModel.getDetails(productId)
    if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND)
    }
    return product
  } catch (error) { throw error }
}

export const productService = {
  createNew,
  getDetails
}
