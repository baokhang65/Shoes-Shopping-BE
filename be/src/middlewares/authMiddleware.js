import { StatusCodes } from 'http-status-codes'
import { JwtProvider } from '~/providers/JwtProvider'
import { env } from '~/config/environment'
import ApiError from '~/utils/ApiError'
import { userModel } from '~/models/userModel'
import { USER_ROLES } from '~/utils/constants'

const isAuthorized = async (req, res, next) => {
  const clientAccessToken = req.cookies?.accessToken

  if (!clientAccessToken) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized! (Token not found)'))
    return
  }

  try {
    const accessTokenDecoded = await JwtProvider.verifyToken(clientAccessToken, env.ACCESS_TOKEN_SECRET_SIGNATURE)
    req.jwtDecoded = accessTokenDecoded
    next()

  } catch (error) {
    if (error?.message?.includes('jwt expired')) {
      next(new ApiError(StatusCodes.GONE, 'Need to refresh token.'))
      return
    }
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized!'))
  }
}

const isAdmin = async (req, res, next) => {
  try {
    if (!req.jwtDecoded || !req.jwtDecoded._id) {
      next(new ApiError(StatusCodes.UNAUTHORIZED, 'Authentication required'))
      return
    }

    const user = await userModel.findOneById(req.jwtDecoded._id)
    if (!user) {
      next(new ApiError(StatusCodes.NOT_FOUND, 'User not found'))
      return
    }

    if (user.role !== USER_ROLES.ADMIN) {
      next(new ApiError(StatusCodes.FORBIDDEN, 'Admin permission required'))
      return
    }

    next()
  } catch (error) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

export const authMiddleware = {
  isAuthorized,
  isAdmin
}