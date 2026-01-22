import { Response, NextFunction } from 'express'
import { HttpStatusCodes as STATUS } from '../constants/httpStatusCodes'
import { errorResponse } from '../utils/response'
import { CustomRequest } from '~/types/customRequest'
import { verifyAccessToken } from '~/utils/jwtToken'
import { userRepo } from '~/repositories/user.repo'

export const requireAuth = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, STATUS.UNAUTHORIZED, 'Unauthorized Access')
    }

    const token = authHeader.split(' ')[1]

    const payload = verifyAccessToken(token)
    if (!payload) {
      return errorResponse(res, STATUS.UNAUTHORIZED, 'Invalid or expired access token')
    }

    const user = await userRepo.findActiveById(payload.id)

    if (!user) {
      return errorResponse(res, STATUS.UNAUTHORIZED, 'Unauthorized Access')
    }

    req.user = user
    next()
  } catch {
    return errorResponse(res, STATUS.UNAUTHORIZED, 'Invalid Request, Token Expired!')
  }
}
