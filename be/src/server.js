/* eslint-disable no-console */
import express from 'express'
import cors from 'cors'
import { corsOptions } from '~/config/cors'
import existHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
import cookieParser from 'cookie-parser'

const START_SERVER = () => {
  const app = express()

  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })

  // Cookie Parser Setting
  app.use(cookieParser())

  app.use(cors(corsOptions))

  //Enable req.body json data
  app.use(express.json())

  //Use APIs v1
  app.use('/v1', APIs_V1)

  //Middlewares error handling
  app.use(errorHandlingMiddleware)

  if (env.BUILD_MODE == 'production' ) {
    app.listen(process.env.PORT, () => {
      console.log(`Hi ${env.AUTHOR} , server running at Port:${ process.env.PORT }`)
    })
  } else {
    app.listen(env.LOCAL_APP_PORT, env.LOCAL_APP_HOST, () => {
      console.log(`Hi ${env.AUTHOR} , server running at http://${ env.LOCAL_APP_HOST }:${ env.LOCAL_APP_PORT }/`)
    })
  }

  //Clean up before stoping server
  existHook(() => {
    CLOSE_DB()
  })
}

//Just connect to database then Start Server Back-end later
//Immediately-invoked/ Anonymous Async Function (IIFE)
(async () => {
  try {
    console.log('Connecting to MongoDB Cloud Atlas...')
    await CONNECT_DB()
    console.log('Connected to MongoDB Cloud Atlas!')

    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()

// //Just connect to database then Start Server Back-end later
// CONNECT_DB()
//   .then(() => console.log('Connected to MongoDB Cloud Atlas!'))
//   .then(() => START_SERVER())
//   .catch(error => {
//     console.error(error)
//     process.exit(0)
//   })
