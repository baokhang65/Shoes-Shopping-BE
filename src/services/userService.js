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
      verifyToken: uuidv4()
    }

    // Create new user in database
    const createdUser = await userModel.createNew(newUser)
    // eslint-disable-next-line no-unused-vars
    const getNewUser = await userModel.findOneById(createdUser.insertedId)

    // // Email send
    // const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${getNewUser.email}&token=${createdUser.verifyToken}`
    // const customSubject = 'Please verify your email before using our services!'
    // const htmlContent = `
    //   <h3>Here is your verification link:</h3>
    //   <h3>${verificationLink}</h3>
    // `
    // await BrevoProvider.sendEmail(getNewUser.email, customSubject, htmlContent)

    // return pickUser(getNewUser)
  } catch (error) { throw error }
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

  } catch (error) { throw error }
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
  } catch (error) { throw error }
}

const refreshToken = async (clientRefreshToken) => {
  try {
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
  } catch (error) { throw error }
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
        throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your Email or Password is incorrect!')
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
  } catch (error) { throw error }
}

// const getProfile = async (userId) => {
//   try {
//     const user = await userModel.findOneById(userId)
//     if (!user) {
//       throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
//     }

//     // Remove sensitive information
//     delete user.password
//     delete user.verifyToken

//     return user
//   } catch (error) { throw error }
// }

// const updateProfile = async (userId, updateData) => {
//   try {
//     const user = await userModel.findOneById(userId)
//     if (!user) {
//       throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
//     }

//     const updatedUser = await userModel.update(userId, updateData)
//     if (updatedUser) {
//       delete updatedUser.password
//       delete updatedUser.verifyToken
//     }

//     return updatedUser
//   } catch (error) { throw error }
// }

// const getAllUsers = async (options) => {
//   try {
//     const result = await userModel.getAllUsers(options)
//     return result
//   } catch (error) { throw error }
// }

// const updateUserRole = async (userId, role) => {
//   try {
//     const user = await userModel.findOneById(userId)
//     if (!user) {
//       throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
//     }

//     const updatedUser = await userModel.updateRole(userId, role)
//     if (updatedUser) {
//       delete updatedUser.password
//       delete updatedUser.verifyToken
//     }

//     return updatedUser
//   } catch (error) { throw error }
// }

export const userService = {
  createNew,
  verifyAccount,
  login,
  refreshToken,
  update
  // getProfile,
  // updateProfile,
  // getAllUsers,
  // updateUserRole
}