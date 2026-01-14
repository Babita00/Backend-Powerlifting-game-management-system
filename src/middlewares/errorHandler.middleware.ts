import { NextFunction, Request, Response } from 'express'

import { HttpStatusCodes as STATUS } from '../constants/httpStatusCodes'
import { createError, toAppError } from '../utils/errors'
import logger from '~/utils/logger'

// Global error handling middleware
export const errorMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const appErr = toAppError(err)

  logger.error(appErr.stack || appErr.message)

  const payload: Record<string, unknown> = {
    success: false,
    message: appErr.message || 'Something went wrong',
  }
  if (process.env.NODE_ENV === 'development' && appErr.info) {
    payload.info = appErr.info
    payload.statusCode = appErr.statusCode
  }

  res.status(appErr.statusCode || STATUS.INTERNAL_SERVER_ERROR).json(payload)
}

// 404 handler to forward to error middleware
export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  next(createError(`Route ${req.originalUrl} not found`, STATUS.NOT_FOUND))
}
