import * as authService from '../services/authService.js'
import AppError from '../utils/AppError.js'

export async function deleteAccount(req, res) {
  const { password } = req.body
  const userId = req.userId
  if (!password) {
    throw new AppError('password required', 400)
  }

  const result = await authService.deleteAccount(userId, password, req.headers)
  res.json(result)
}

