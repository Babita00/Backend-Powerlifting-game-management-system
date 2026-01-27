import { userRole } from '~/constants/userRole'

export type AuthUser = {
  id: string
  role: userRole
}
