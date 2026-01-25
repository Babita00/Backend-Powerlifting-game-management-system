import { userRole } from './../constants/userRole'
import { type User } from '../models/user.entity'

export const isAdmin = (user: User): boolean => {
  return Boolean(user) && user.role === userRole.ADMIN
}

export const isOfficial = (user: User): boolean => {
  return Boolean(user) && user.role === userRole.OFFICIAL
}

export const isAdminOrOfficial = (user: User): boolean => {
  return (
    Boolean(user) && (user.role === userRole.ADMIN || user.role === userRole.OFFICIAL)
  )
}
