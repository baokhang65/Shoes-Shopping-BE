/* eslint-disable no-unused-vars */
import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'

// Error Handling Middleware Back-end NodeJS (ExpressJS)
export const errorHandlingMiddleware = (err, req, res, next) => {

  // If don't have statusCode so default set code 500 INTERNAL_SERVER_ERROR
  if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR

  // create responseError to control error want to response
  const responseError = {
    statusCode: err.statusCode,
    message: err.message || StatusCodes[err.statusCode], // If error don't have message, take ReasonPhrases following Status Code
    stack: err.stack
  }
  // console.error(responseError)

  if (env.BUILD_MODE !== 'dev') delete responseError.stack
  // console.error(responseError)

  // Response responseError to Front-end
  res.status(responseError.statusCode).json(responseError)
}
