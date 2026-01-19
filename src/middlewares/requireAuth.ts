import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { UserRepo } from '../repositories/user.repo'
import { HttpStatusCodes as STATUS } from '../constants/httpStatusCodes'
import { errorResponse } from '../utils/response'

interface AccessTokenPayload {
  id: string
  role: string
  iat: number
  exp: number
}

// Extend Express Request safely
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        role: string
      }
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, STATUS.UNAUTHORIZED, 'Access token missing')
    }

    const token = authHeader.split(' ')[1]
    const secret = process.env.ACCESS_TOKEN_SECRET

    if (!secret) {
      throw new Error('ACCESS_TOKEN_SECRET not configured')
    }

    let payload: AccessTokenPayload
    try {
      payload = jwt.verify(token, secret) as AccessTokenPayload
    } catch {
      return errorResponse(res, STATUS.UNAUTHORIZED, 'Invalid or expired token')
    }

    // Optional DB check (recommended)
    const user = await UserRepo.findActiveById(payload.id)
    if (!user) {
      return errorResponse(res, STATUS.UNAUTHORIZED, 'User not found or inactive')
    }

    // Attach minimal user info to request
    req.user = {
      id: user.id,
      role: payload.role,
    }

    next()
  } catch (err) {
    next(err)
  }
}
