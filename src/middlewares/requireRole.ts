import { Request, Response, NextFunction } from 'express'
import { HttpStatusCodes as STATUS } from '../constants/httpStatusCodes'
import { userRole } from '../constants/userRole'
import { errorResponse } from '~/utils/response'

export const requireRole =
  (allowedRoles: userRole[]) => (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return errorResponse(res, STATUS.UNAUTHORIZED, 'Unauthorized')
    }

    const { role } = req.user

    if (!allowedRoles.includes(role as userRole)) {
      return errorResponse(
        res,
        STATUS.FORBIDDEN,
        'You do not have permission to access this resource'
      )
    }

    next()
  }
