import { userRole } from './../constants/userRole'
import { type User } from '../models/user.entity'

export function isAdmin(user: User): boolean {
  return Boolean(user) && user.role === userRole.ADMIN
}

export function isOfficial(user: User): boolean {
  return Boolean(user) && user.role === userRole.OFFICIAL
}

export function isAdminOrOfficial(user: User): boolean {
  return (
    Boolean(user) && (user.role === userRole.ADMIN || user.role === userRole.OFFICIAL)
  )
}
