import { StatusCodes } from 'http-status-codes'
import { productService } from '~/services/productService'

const createNew = async (req, res, next) => {
  try {
    // Service layer
    const createProduct = await productService.createNew(req.body)

    // throw new ApiError(StatusCodes.BAD_GATEWAY, 'Test error')
    res.status(StatusCodes.CREATED).json(createProduct)
  } catch (error) { next(error) }
}

const getDetails = async (req, res, next) => {
  try {
    const productID = req.params.id
    const product = await productService.getDetails(productID)
    res.status(StatusCodes.OK).json(product)
  } catch (error) { next(error) }
}

export const productController = {
  createNew,
  getDetails
}