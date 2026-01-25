import { Request, Response } from 'express'
import * as AuthService from '../services/auth.service'
import { HttpStatusCodes as STATUS } from '../constants/httpStatusCodes'
import { errorResponse, successResponse } from '~/utils/response'
import { CustomRequest } from '~/types/customRequest'
import { toUserResponse } from '~/utils/userMapper'
import { userRepo } from '~/repositories/user.repo'

const setRefreshCookie = (res: Response, token: string) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/auth/refresh',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

const clearRefreshCookie = (res: Response) => {
  res.clearCookie('refreshToken', { path: '/auth/refresh' })
}

export const register = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body
  const result = await AuthService.register({ firstName, lastName, email, password })
  return successResponse(res, STATUS.OK, 'User registered successfully', result)
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  const { accessToken, refreshToken } = await AuthService.login({
    email,
    password,
    userAgent: req.headers['user-agent'] ?? null,
    ip: req.ip ?? null,
  })

  setRefreshCookie(res, refreshToken)
  return successResponse(res, STATUS.OK, 'User logged in successfully', accessToken)
}

export const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken
  if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' })

  const { accessToken, refreshToken: newRefreshToken } =
    await AuthService.refreshRotate({
      refreshToken,
      userAgent: req.headers['user-agent'] ?? null,
      ip: req.ip ?? null,
    })

  setRefreshCookie(res, newRefreshToken)
  return res.status(200).json({ accessToken })
}

export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken
  if (refreshToken) await AuthService.logout({ refreshToken })

  clearRefreshCookie(res)
  return successResponse(res, STATUS.OK, 'Logged out')
}

export const me = async (req: CustomRequest, res: Response) => {
  const authUser = req.user

  if (!authUser?.id) {
    return errorResponse(res, STATUS.UNAUTHORIZED, 'Unauthorized')
  }

  const user = await userRepo.findActiveById(authUser.id)
  if (!user) {
    return errorResponse(res, STATUS.NOT_FOUND, 'User not found')
  }

  return successResponse(
    res,
    STATUS.OK,
    'Data fetched successfully',
    toUserResponse(user)
  )
}
