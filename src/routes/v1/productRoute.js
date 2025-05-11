import express from 'express'
import { productValidation } from '~/validations/productValidation'
import { productController } from '~/controllers/productController'
import { multerUploadMiddleware } from '~/middlewares/multerUploadMiddleware'

const Router = express.Router()

Router.route('/')
  .get(productController.getAllProducts)
  .post(multerUploadMiddleware.upload.single('image'), productValidation.createNew, productController.createNew)

Router.route('/search')
  .get(productController.searchProducts)

Router.route('/brand/:brandId')
  .get(productController.getProductsByBrand)

Router.route('/featured')
  .get(productController.getFeaturedProducts)

Router.route('/:id')
  .get(productController.getDetails)
  .put(productValidation.update, productController.updateProduct)
  .delete(productController.deleteProduct)

Router.route('/:id/stock')
  .patch(productValidation.updateStock, productController.updateProductStock)

export const productRoute = Router
