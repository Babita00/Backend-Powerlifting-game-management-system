import { User } from '../models/user.entity'

export const toUserResponse = (user: User) => {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    age: user.age,
    weight: user.weight,
    gender: user.gender,
    role: user.role,
    isActive: user.isActive,
  }
}
