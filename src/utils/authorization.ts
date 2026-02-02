import { userRole } from '../constants/userRole'
import type { AuthUser } from '~/types/authUser'

export const isAdmin = (user: AuthUser): boolean => {
  return Boolean(user) && user.role === userRole.ADMIN
}

export const isOfficial = (user: AuthUser): boolean => {
  return Boolean(user) && user.role === userRole.OFFICIAL
}

export const isAdminOrOfficial = (user: AuthUser): boolean => {
  return (
    Boolean(user) && (user.role === userRole.ADMIN || user.role === userRole.OFFICIAL)
  )
}
