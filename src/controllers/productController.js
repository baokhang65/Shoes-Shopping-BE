import { StatusCodes } from 'http-status-codes'
import { productService } from '~/services/productService'

const createNew = async (req, res, next) => {
  try {
    // Service layer
    const createProduct = await productService.createNew(req.body)
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

const getAllProducts = async (req, res, next) => {
  try {
    // Pass all query params to service for pagination, sorting, etc.
    const result = await productService.getAllProducts(req.query)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const searchProducts = async (req, res, next) => {
  try {
    const result = await productService.searchProducts(req.query.keyword)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const getProductsByBrand = async (req, res, next) => {
  try {
    const { brandId } = req.params
    // Pass query params for pagination
    const result = await productService.getProductsByBrand(brandId, req.query)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const getFeaturedProducts = async (req, res, next) => {
  try {
    const featuredProducts = await productService.getFeaturedProducts()
    res.status(StatusCodes.OK).json(featuredProducts)
  } catch (error) { next(error) }
}

const updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id
    const updatedProduct = await productService.updateProduct(productId, req.body)
    res.status(StatusCodes.OK).json(updatedProduct)
  } catch (error) { next(error) }
}

const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id
    const result = await productService.deleteProduct(productId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const updateProductStock = async (req, res, next) => {
  try {
    const productId = req.params.id
    const { sizes } = req.body
    const updatedProduct = await productService.updateProductStock(productId, sizes)
    res.status(StatusCodes.OK).json(updatedProduct)
  } catch (error) { next(error) }
}

export const productController = {
  createNew,
  getDetails,
  getAllProducts,
  searchProducts,
  getProductsByBrand,
  getFeaturedProducts,
  updateProduct,
  deleteProduct,
  updateProductStock
}
