import { NextFunction, Request, Response } from 'express'
import { HttpStatusCodes as STATUS } from '../constants/httpStatusCodes'

export type AppError = {
  name: 'AppError'
  message: string
  statusCode: number
  isOperational: true
  info?: unknown
  stack?: string
}

export const createError = (
  message: string,
  statusCode: number = STATUS.INTERNAL_SERVER_ERROR,
  info?: unknown
): AppError => {
  const stack = new Error(message).stack
  return { name: 'AppError', message, statusCode, isOperational: true, info, stack }
}

export const isAppError = (err: unknown): err is AppError => {
  if (typeof err !== 'object' || err === null) {
    return false
  }
  const e = err as Partial<AppError>
  return e.name === 'AppError' && typeof e.statusCode === 'number'
}

export const toAppError = (err: unknown): AppError => {
  if (isAppError(err)) {
    return err
  }
  if (err instanceof Error) {
    return createError(err.message, STATUS.INTERNAL_SERVER_ERROR, undefined)
  }
  return createError('Internal Server Error')
}

export const errorCatcher = <
  T extends (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
>(
  fn: T
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
