/* eslint-disable no-useless-catch */
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { USER_ROLES } from '~/utils/constants'

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
      password: await bcrypt.hash(reqBody.password, 10), // Salt rounds = 10
      username: reqBody.username || nameFromEmail,
      displayName: reqBody.displayName || nameFromEmail,
      role: reqBody.role || USER_ROLES.CUSTOMER,
      verifyToken: uuidv4(),
      createdAt: new Date(),
      updatedAt: null
    }

    // Create new user in database
    const result = await userModel.createNew(newUser)

    // Get the created user but remove sensitive information
    const createdUser = await userModel.findOneById(result.insertedId)
    if (createdUser) {
      delete createdUser.password
      delete createdUser.verifyToken
    }

    return createdUser
  } catch (error) { throw error }
}

const login = async (reqBody) => {
  try {
    // Find user by email
    const user = await userModel.findOneByEmail(reqBody.email)
    if (!user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials')
    }

    // Check if account is active
    if (!user.isActive) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Account is deactivated')
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(reqBody.password, user.password)
    if (!isPasswordValid) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials')
    }

    // Return user data (without sensitive information)
    const userData = { ...user }
    delete userData.password
    delete userData.verifyToken

    // Here we would typically generate a JWT token, but as requested
    // we're not implementing JWT in this code

    return userData
  } catch (error) { throw error }
}

const getProfile = async (userId) => {
  try {
    const user = await userModel.findOneById(userId)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }

    // Remove sensitive information
    delete user.password
    delete user.verifyToken

    return user
  } catch (error) { throw error }
}

const updateProfile = async (userId, updateData) => {
  try {
    const user = await userModel.findOneById(userId)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }

    const updatedUser = await userModel.update(userId, updateData)
    if (updatedUser) {
      delete updatedUser.password
      delete updatedUser.verifyToken
    }

    return updatedUser
  } catch (error) { throw error }
}

const getAllUsers = async (options) => {
  try {
    const result = await userModel.getAllUsers(options)
    return result
  } catch (error) { throw error }
}

const updateUserRole = async (userId, role) => {
  try {
    const user = await userModel.findOneById(userId)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }

    const updatedUser = await userModel.updateRole(userId, role)
    if (updatedUser) {
      delete updatedUser.password
      delete updatedUser.verifyToken
    }

    return updatedUser
  } catch (error) { throw error }
}

export const userService = {
  createNew,
  login,
  getProfile,
  updateProfile,
  getAllUsers,
  updateUserRole
}