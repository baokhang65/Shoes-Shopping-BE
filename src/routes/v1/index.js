import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { productRoute } from './productRoute'
import { cartRoute } from './cartRoute'
import { orderRoute } from './orderRoute'

const Router = express.Router()

/* Check APIs v1/status */
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs V1 are ready to use.' })
})

/* Product APIs */
Router.use('/products', productRoute)
// Router.use('/cart', cartRoute)
// Router.use('/orders', orderRoute)

export const APIs_V1 = Router
