import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'
import ms from 'ms'
import ApiError from '~/utils/ApiError'

const createNew = async (req, res, next) => {
  try {
    const createdUser = await userService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createdUser)
  } catch (error) { next(error) }
}

const verifyAccount = async (req, res, next) => {
  try {
    const result = await userService.verifyAccount(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const login = async (req, res, next) => {
  try {
    const userData = await userService.login(req.body)

    res.cookie('accessToken', userData.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })
    res.cookie('refreshToken', userData.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    // eslint-disable-next-line no-unused-vars
    const { accessToken, refreshToken, ...userDataToReturn } = userData

    res.status(StatusCodes.OK).json({
      ...userDataToReturn,
      loggedIn: true
    })
  } catch (error) { next(error) }
}

const logout = async (req, res, next) => {
  try {
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')

    res.status(StatusCodes.OK).json({ loggedOut: true })
  } catch (error) { next(error) }
}

const refreshToken = async (req, res, next) => {
  try {
    const result = await userService.refreshToken(req.cookies?.refreshToken)

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    res.status(StatusCodes.OK).json({ refreshed: true })
  } catch (error) {
    next(new ApiError(StatusCodes.FORBIDDEN, 'Please Sign In! (Error from refresh Token)'))
  }
}

const update = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const updatedUser = await userService.update(userId, req.body)
    res.status(StatusCodes.OK).json(updatedUser)
  } catch (error) { next(error) }
}

const getProfile = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id

    const user = await userService.getProfile(userId)
    res.status(StatusCodes.OK).json(user)
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
  verifyAccount,
  logout,
  refreshToken,
  update,
  getProfile,
  getAllUsers,
  updateUserRole
}