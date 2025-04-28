import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { USER_ROLES } from '~/utils/constants'

// Define Collection (name & schema)
const USER_COLLECTION_NAME = 'users'

const USER_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE), // unique
  password: Joi.string().required(),
  username: Joi.string().required().trim().strict(),
  displayName: Joi.string().required().trim().strict(),
  avatar: Joi.string().default(null),
  role: Joi.string().valid(USER_ROLES.GUEST, USER_ROLES.CUSTOMER, USER_ROLES.ADMIN).default(USER_ROLES.CUSTOMER),
  isActive: Joi.boolean().default(true),
  verifyToken: Joi.string(),
  createdAt: Joi.date().default(Date.now),
  updatedAt: Joi.date().allow(null)
}).strict()

const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const result = await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validData)
    return result
  } catch (error) { throw new Error(error) }
}

const findOneByEmail = async (email) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({ email })
    return result
  } catch (error) { throw new Error(error) }
}

const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({ _id: new ObjectId(String(id)) })
    return result
  } catch (error) { throw new Error(error) }
}

const update = async (id, updateData) => {
  try {
    // Remove fields that shouldn't be updated directly
    delete updateData._id
    delete updateData.email
    delete updateData.password

    // Set update timestamp
    updateData.updatedAt = new Date()

    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(String(id)) },
      { $set: updateData },
      { returnDocument: 'after' }
    )

    return result
  } catch (error) { throw new Error(error) }
}

const updateRole = async (id, role) => {
  try {
    // Validate role
    if (!Object.values(USER_ROLES).includes(role)) {
      throw new Error('Invalid user role')
    }

    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(String(id)) },
      {
        $set: {
          role,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    )

    return result
  } catch (error) { throw new Error(error) }
}

// Get all users (for admin)
const getAllUsers = async ({ page = 1, limit = 10, sortBy = 'createdAt', sortOrder = -1 }) => {
  try {
    const skip = (page - 1) * limit
    // Build sort
    const sort = {}
    sort[sortBy] = sortOrder

    const results = await GET_DB().collection(USER_COLLECTION_NAME)
      .find({ isActive: true })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray()

    // Get total count for pagination
    const totalCount = await GET_DB().collection(USER_COLLECTION_NAME).countDocuments({ isActive: true })

    return {
      users: results.map(user => {
        // Don't return password in user list
        delete user.password
        delete user.verifyToken
        return user
      }),
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        limit
      }
    }
  } catch (error) { throw new Error(error) }
}

export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  USER_ROLES,
  createNew,
  findOneByEmail,
  findOneById,
  update,
  updateRole,
  getAllUsers
}