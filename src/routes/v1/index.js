import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { productRoute } from './productRoute'

const Router = express.Router()

/* Check APIs v1/status */
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs V1 are ready to use.' })
})

/* Product APIs */
Router.use('/products', productRoute)

export const APIs_V1 = Router
