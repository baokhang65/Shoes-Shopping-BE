/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'
import { productModel } from '~/models/productModel'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { USER_ROLES } from '~/utils/constants'
import { CloudinaryProvider } from '~/providers/cloudinaryProvider'

// Helper function to check admin permissions
const checkAdminPermission = async (userId) => {
  if (!userId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Authentication required')
  }

  const user = await userModel.findOneById(userId)
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  }

  if (user.role !== USER_ROLES.ADMIN) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Admin permission required')
  }

  return true
}

const createNew = async (reqBody, userId, productImgFile) => {
  try {
    // Check admin permissions
    await checkAdminPermission(userId)

    const newProduct = {
      ...reqBody,
      slug: slugify(reqBody.name),
      isActive: true,
      createdAt: new Date(),
      updatedAt: null
    }

    if (productImgFile) {
      const uploadResult = await CloudinaryProvider.streamUpload(productImgFile.buffer, 'products')
      newProduct.image = uploadResult.secure_url
    }

    const createProduct = await productModel.createNew(newProduct)
    const getNewProduct = await productModel.findOneById(createProduct.insertedId)

    return getNewProduct
  } catch (error) { throw error }
}

const getDetails = async (productId) => {
  try {
    const product = await productModel.getDetails(productId)
    return product
  } catch (error) {
    if (error.message === 'Product not found') {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
    }
    throw error
  }
}

const getAllProducts = async (query = {}) => {
  try {
    // Extract pagination parameters
    const page = parseInt(query.page) || 1
    const limit = parseInt(query.limit) || 12
    // Sort options
    let sortOption = { createdAt: -1 } // Default sort
    if (query.sort) {
      if (query.sort === 'price_asc') {
        sortOption = { price: 1 }
      } else if (query.sort === 'price_desc') {
        sortOption = { price: -1 }
      } else if (query.sort === 'newest') {
        sortOption = { createdAt: -1 }
      }
    }
    const result = await productModel.getAllProducts({
      page,
      limit,
      sort: sortOption
    })
    return result
  } catch (error) { throw error }
}

const searchProducts = async (keyword) => {
  try {
    if (!keyword || keyword.trim() === '') {
      return { products: [], pagination: { totalCount: 0, totalPages: 0, currentPage: 1, limit: 12 } }
    }
    // This would need to be implemented in the model
    // For now, returning empty result
    return {
      products: [],
      pagination: {
        totalCount: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 12
      }
    }
  } catch (error) { throw error }
}

const getProductsByBrand = async (brandId, query = {}) => {
  try {
    // Extract pagination parameters
    const page = parseInt(query.page) || 1
    const limit = parseInt(query.limit) || 12
    // Sort options
    let sortOption = { createdAt: -1 } // Default sort
    if (query.sort) {
      if (query.sort === 'price_asc') {
        sortOption = { price: 1 }
      } else if (query.sort === 'price_desc') {
        sortOption = { price: -1 }
      } else if (query.sort === 'newest') {
        sortOption = { createdAt: -1 }
      }
    }
    const result = await productModel.getProductsByBrand(
      brandId,
      { page, limit, sort: sortOption }
    )
    return result
  } catch (error) { throw error }
}

const getFeaturedProducts = async () => {
  try {
    // Currently not implemented in the model
    // Return a basic set of products
    const result = await productModel.getAllProducts({
      page: 1,
      limit: 8,
      sort: { createdAt: -1 }
    })
    return result
  } catch (error) { throw error }
}

const updateProduct = async (productId, updateData, userId, productImgFile) => {
  try {
    // Check admin permissions
    await checkAdminPermission(userId)

    // If name is being updated, update slug too
    if (updateData.name) {
      updateData.slug = slugify(updateData.name)
    }
    // Delete unnecessary fields if they exist
    delete updateData._id

    if (productImgFile) {
      const result = await CloudinaryProvider.streamUpload(
        productImgFile.buffer,
        'products'
      )
      updateData.image = result.secure_url
    }

    // Set update timestamp
    updateData.updatedAt = new Date()

    const updatedProduct = await productModel.updateProduct(productId, updateData)
    if (!updatedProduct) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
    }
    return updatedProduct
  } catch (error) { throw error }
}

const deleteProduct = async (productId, userId) => {
  try {
    // Check admin permissions
    await checkAdminPermission(userId)

    // Using soft delete from the model (sets isActive to false)
    const result = await productModel.deleteProduct(productId)
    if (!result) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
    }
    return { message: 'Product deleted successfully' }
  } catch (error) { throw error }
}

const updateProductStock = async (productId, sizes, userId) => {
  try {
    // Check admin permissions
    await checkAdminPermission(userId)

    // Find the current product to confirm it exists
    const existingProduct = await productModel.findOneById(productId)
    if (!existingProduct) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
    }

    // Update product with new size data
    const updatedProduct = await productModel.updateProduct(productId, {
      sizes,
      updatedAt: new Date()
    })
    return updatedProduct
  } catch (error) { throw error }
}

export const productService = {
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