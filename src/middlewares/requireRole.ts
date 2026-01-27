import { Response, NextFunction } from 'express'
import { HttpStatusCodes as STATUS } from '../constants/httpStatusCodes'
import { userRole } from '../constants/userRole'
import { errorResponse } from '~/utils/response'
import { CustomRequest } from '~/types/customRequest'

export const requireRole =
  (allowedRoles: userRole[]) =>
  (req: CustomRequest, res: Response, next: NextFunction) => {
    const user = req.user

    if (!user) {
      return errorResponse(res, STATUS.UNAUTHORIZED, 'Unauthorized')
    }

    if (!allowedRoles.includes(user.role)) {
      return errorResponse(
        res,
        STATUS.FORBIDDEN,
        'You do not have permission to access this resource'
      )
    }

    next()
  }

/*
  Usage Example:
  router.post(
  '/admin/create-official',
  requireAuth,
  requireRole([userRole.ADMIN]),
  controller
)
*/
