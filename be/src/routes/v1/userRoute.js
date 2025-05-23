import express from 'express'
import { userValidation } from '~/validations/userValidation'
import { userController } from '~/controllers/userController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

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

Router.route('/validate-token')
  .get(authMiddleware.isAuthorized, (req, res) => {
    res.status(200).json({
      valid: true,
      user: {
        id: req.jwtDecoded._id,
        email: req.jwtDecoded.email
      }
    })
  })

Router.route('/update')
  .put(authMiddleware.isAuthorized, userValidation.update, userController.update)

Router.route('/profile')
  .get(authMiddleware.isAuthorized, userController.getProfile)

Router.route('/admin/users')
  .get(authMiddleware.isAuthorized, authMiddleware.isAdmin, userController.getAllUsers)

Router.route('/admin/users/:id/role')
  .patch(
    authMiddleware.isAuthorized,
    authMiddleware.isAdmin,
    userValidation.updateUserRole,
    userController.updateUserRole
  )

export const userRoute = Router