/* eslint-disable no-useless-catch */
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { USER_ROLES } from '~/utils/constants'
import { pickUser } from '~/utils/formatters'
import { env } from '~/config/environment'
import { JwtProvider } from '~/providers/JwtProvider'
// import { WEBSITE_DOMAIN } from '~/utils/constants'
// import { BrevoProvider } from '~/providers/BrevoProvider'

const createNew = async (reqBody) => {
  try {
    // Check if email already exists
    const existUser = await userModel.findOneByEmail(reqBody.email)
    if (existUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email already exists!')
    }

    // Create a username from email if not provided
    const nameFromEmail = reqBody.email.split('@')[0]
    const newUser = {
      email: reqBody.email,
      password: bcrypt.hashSync(reqBody.password, 8), // Salt rounds = 8
      username: reqBody.username || nameFromEmail,
      displayName: reqBody.displayName || nameFromEmail,
      role: reqBody.role || USER_ROLES.CUSTOMER,
      verifyToken: null,
      isActive: true,
    }

    // Create new user in database
    const createdUser = await userModel.createNew(newUser)
    const getNewUser = await userModel.findOneById(createdUser.insertedId)

    // Email send - uncomment nếu đã cấu hình email provider
    // if (env.BREVO_API_KEY && env.ADMIN_EMAIL_ADDRESS) {
    //   try {
    //     const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${getNewUser.email}&token=${getNewUser.verifyToken}`
    //     const customSubject = 'Please verify your email before using our services!'
    //     const htmlContent = `
    //       <h3>Here is your verification link:</h3>
    //       <h3>${verificationLink}</h3>
    //     `
    //     await BrevoProvider.sendEmail(getNewUser.email, customSubject, htmlContent)
    //   } catch (emailError) {
    //     console.error('Failed to send verification email:', emailError.message)
    //   }
    // }

    return pickUser(getNewUser)
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new Error(`User creation failed: ${error.message}`)
  }
}

const verifyAccount = async (reqBody) => {
  try {
    const existUser = await userModel.findOneByEmail(reqBody.email)

    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is already active!')
    if (reqBody.token !== existUser.verifyToken) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Token is invalid!')

    const updateData = {
      isActive: true,
      verifyToken: null
    }
    const updatedUser = await userModel.update(existUser._id, updateData)

    return pickUser(updatedUser)

  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new Error(`Account verification failed: ${error.message}`)
  }
}

const login = async (reqBody) => {
  try {
    // Find user by email
    const user = await userModel.findOneByEmail(reqBody.email)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    }

    // Check if account is active
    if (!user.isActive) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')
    }

    // Verify password
    if (!bcrypt.compareSync(reqBody.password, user.password)) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your Email or Password is incorrect!')
    }

    const userInfo = { _id: user._id, email: user.email }

    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    )

    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      env.REFRESH_TOKEN_LIFE
    )

    return { accessToken, refreshToken, ...pickUser(user) }
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new Error(`Login failed: ${error.message}`)
  }
}

const refreshToken = async (clientRefreshToken) => {
  try {
    if (!clientRefreshToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Refresh token is required')
    }

    const refreshTokenDecoded = await JwtProvider.verifyToken(clientRefreshToken, env.REFRESH_TOKEN_SECRET_SIGNATURE)

    const userInfo = {
      _id: refreshTokenDecoded._id,
      email: refreshTokenDecoded.email
    }

    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    )

    return { accessToken }
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new Error(`Token refresh failed: ${error.message}`)
  }
}

const update = async (userId, reqBody) => {
  try {
    const existUser = await userModel.findOneById(userId)
    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')

    let updatedUser = {}
    // Case 1: change password
    if (reqBody.current_password && reqBody.new_password) {
      // Check current password
      if (!bcrypt.compareSync(reqBody.current_password, existUser.password)) {
        throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your current password is incorrect!')
      }
      // If current password right then hashed it
      updatedUser = await userModel.update(existUser._id, {
        password: bcrypt.hashSync(reqBody.new_password, 8)
      })
    } else {
      // Case 2: update profile information
      updatedUser = await userModel.update(existUser._id, reqBody)
    }
    return pickUser(updatedUser)
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new Error(`Profile update failed: ${error.message}`)
  }
}

const getProfile = async (userId) => {
  try {
    const user = await userModel.findOneById(userId)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }

    // Remove sensitive information
    return pickUser(user)
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new Error(`Failed to retrieve user profile: ${error.message}`)
  }
}

const updateUserRole = async (userId, role) => {
  try {
    const user = await userModel.findOneById(userId)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }

    // Validate role
    if (!Object.values(USER_ROLES).includes(role)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid user role')
    }

    const updatedUser = await userModel.updateRole(userId, role)
    if (!updatedUser) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to update user role')
    }

    return pickUser(updatedUser)
  } catch (error) {
    if (error.name === 'ApiError') throw error
    throw new Error(`Failed to update user role: ${error.message}`)
  }
}

const getAllUsers = async (options) => {
  try {
    const result = await userModel.getAllUsers(options)
    return result
  } catch (error) {
    throw new Error(`Failed to retrieve users: ${error.message}`)
  }
}

export const userService = {
  createNew,
  verifyAccount,
  login,
  refreshToken,
  update,
  getProfile,
  updateUserRole,
  getAllUsers
}