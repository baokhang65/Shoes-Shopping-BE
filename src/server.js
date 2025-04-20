/* eslint-disable no-console */
import express from 'express'
import existHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'

const START_SERVER = () => {
  const app = express()

  app.use('/v1', APIs_V1)

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`Hi ${env.AUTHOR} , server running at http://${ env.APP_HOST }:${ env.APP_PORT }/`)
  })

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
