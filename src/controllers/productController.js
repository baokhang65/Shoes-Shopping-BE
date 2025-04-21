import { StatusCodes } from 'http-status-codes'

const createNew = async (req, res, next) => {
  try {
    // console.log('req.body:', req.body)
    // console.log('req.query:', req.query)
    // console.log('req.params:', req.params)

    // throw new ApiError(StatusCodes.BAD_GATEWAY, 'Test error')
    res.status(StatusCodes.CREATED).json({ message: 'POST from Controller: APIs create list products.' })
  } catch (error) { next(error) }
}

export const productController = {
  createNew
}
