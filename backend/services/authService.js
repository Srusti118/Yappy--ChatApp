import { auth } from '../config/auth.js'
import * as userModel from '../models/userModel.js'
import AppError from '../utils/AppError.js'

export async function deleteAccount(userId, password, headers) {
  try {
    const verification = await auth.api.verifyPassword({
      body: { password },
      headers
    })

    if (!verification || !verification.status) {
      throw new AppError('Invalid password', 401)
    }
  } catch (err) {
    throw new AppError('Invalid password', 401)
  }

  await userModel.removeById(userId)

  return { message: 'Account deleted' }
}

