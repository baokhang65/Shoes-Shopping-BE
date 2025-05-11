import express from 'express'
import { userValidation } from '~/validations/userValidation'
import { userController } from '~/controllers/userController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Public routes
Router.route('/register')
  .post(userValidation.createNew, userController.createNew)

Router.route('/verify')
  .put(userValidation.verifyAccount, userController.verifyAccount)

Router.route('/login')
  .post(userValidation.login, userController.login)

Router.route('/logout')
  .delete(userController.logout)

Router.route('/refresh_token')
  .get(userController.refreshToken)

Router.route('/update')
  .put(authMiddleware.isAuthorized, userValidation.update, userController.update)
// // User profile routes
// Router.route('/profile')
//   .get(userController.getProfile)

// Router.route('/profile/:id')
//   .patch(userValidation.updateProfile, userController.updateProfile)

// // Admin routes
// Router.route('/all')
//   .get(userController.getAllUsers)

// Router.route('/:id/role')
//   .patch(userValidation.updateUserRole, userController.updateUserRole)

export const userRoute = Router