/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'
import { productModel } from '~/models/productModel'

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

export const productService = {
  createNew
}
