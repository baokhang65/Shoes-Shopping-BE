import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'

const createNew = async (req, res, next) => {
  try {
    const createdUser = await userService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createdUser)
  } catch (error) { next(error) }
}

const login = async (req, res, next) => {
  try {
    const userData = await userService.login(req.body)
    res.status(StatusCodes.OK).json(userData)
  } catch (error) { next(error) }
}

const getProfile = async (req, res, next) => {
  try {
    // In a real app with middleware, we'd get userId from req.user
    // But as requested, we're not implementing middleware, so we'll use query parameter
    const userId = req.query.userId
    if (!userId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'User ID is required'
      })
    }

    const user = await userService.getProfile(userId)
    res.status(StatusCodes.OK).json(user)
  } catch (error) { next(error) }
}

const updateProfile = async (req, res, next) => {
  try {
    // In a real app with middleware, we'd get userId from req.user
    const userId = req.params.id
    const updatedUser = await userService.updateProfile(userId, req.body)
    res.status(StatusCodes.OK).json(updatedUser)
  } catch (error) { next(error) }
}

const getAllUsers = async (req, res, next) => {
  try {
    // Extract query parameters for pagination, filtering, and sorting
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const sortBy = req.query.sortBy || 'createdAt'
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1

    const result = await userService.getAllUsers({
      page,
      limit,
      sortBy,
      sortOrder
    })

    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const updateUserRole = async (req, res, next) => {
  try {
    const userId = req.params.id
    const { role } = req.body
    const updatedUser = await userService.updateUserRole(userId, role)
    res.status(StatusCodes.OK).json(updatedUser)
  } catch (error) { next(error) }
}

export const userController = {
  createNew,
  login,
  getProfile,
  updateProfile,
  getAllUsers,
  updateUserRole
}