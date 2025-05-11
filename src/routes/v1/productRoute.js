import express from 'express'
import { productValidation } from '~/validations/productValidation'
import { productController } from '~/controllers/productController'
import { multerUploadMiddleware } from '~/middlewares/multerUploadMiddleware'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/')
  .get(productController.getAllProducts)
  .post(
    authMiddleware.isAuthorized,
    multerUploadMiddleware.upload.single('image'),
    productValidation.createNew,
    productController.createNew
  )

Router.route('/search')
  .get(productController.searchProducts)

Router.route('/brand/:brandId')
  .get(productController.getProductsByBrand)

Router.route('/:id')
  .get(productController.getDetails)
  .put(
    authMiddleware.isAuthorized,
    multerUploadMiddleware.upload.single('image'),
    productValidation.update,
    productController.updateProduct
  )
  .delete(
    authMiddleware.isAuthorized,
    productController.deleteProduct
  )

Router.route('/:id/stock')
  .patch(
    authMiddleware.isAuthorized,
    productValidation.updateStock,
    productController.updateProductStock
  )

export const productRoute = Router