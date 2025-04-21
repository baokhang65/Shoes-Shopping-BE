import { StatusCodes } from 'http-status-codes'
import { productService } from '~/services/productService'

const createNew = async (req, res, next) => {
  try {
    // console.log('req.body:', req.body)
    // console.log('req.query:', req.query)
    // console.log('req.params:', req.params)

    // Service layer
    const createProduct = await productService.createNew(req.body)

    // throw new ApiError(StatusCodes.BAD_GATEWAY, 'Test error')
    res.status(StatusCodes.CREATED).json(createProduct)
  } catch (error) { next(error) }
}

export const productController = {
  createNew
}
