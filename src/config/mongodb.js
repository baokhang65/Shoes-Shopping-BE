import { env } from '~/config/environment'
import { MongoClient, ServerApiVersion } from 'mongodb'

let shoesDatabaseInstance = null

//Client to connect MongoDB
const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

//Database connection
export const CONNECT_DB= async () => {
  //Connect to MongoDB Atlas with URI
  await mongoClientInstance.connect()

  shoesDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME)
}

export const CLOSE_DB = async () => {
  await mongoClientInstance.close()
}

export const GET_DB = () => {
  if (!shoesDatabaseInstance) throw new Error('Must connect Database first!')
  return shoesDatabaseInstance
}
