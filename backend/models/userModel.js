import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
    },
    image: {
      type: String,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
    collection: 'user', // Align with Better Auth's default singular user table
  }
)

// Force connection to singular 'user' collection
const User = mongoose.model('User', userSchema, 'user')

function toClientUser(user) {
  if (!user) return null
  return {
    id: user._id.toString(),
    username: user.username || user.name || '',
    email: user.email,
  }
}

export async function removeById(userId) {
  await User.findByIdAndDelete(userId)
}

export { User }
