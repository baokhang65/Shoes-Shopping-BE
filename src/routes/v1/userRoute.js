import express from 'express'
import { userValidation } from '~/validations/userValidation'
import { userController } from '~/controllers/userController'

const Router = express.Router()

// Public routes
Router.route('/register')
  .post(userValidation.createNew, userController.createNew)

Router.route('/verify')
  .put(userValidation.verifyAccount, userController.verifyAccount)

Router.route('/login')
  .post(userValidation.login, userController.login)

// User profile routes
Router.route('/profile')
  .get(userController.getProfile)

Router.route('/profile/:id')
  .patch(userValidation.updateProfile, userController.updateProfile)

// Admin routes
Router.route('/all')
  .get(userController.getAllUsers)

Router.route('/:id/role')
  .patch(userValidation.updateUserRole, userController.updateUserRole)

export const userRoute = Router