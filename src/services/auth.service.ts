import AppDataSource from '../config/db'
import { userRepo } from '../repositories/user.repo.ts'
import { RefreshTokenRepo } from '../repositories/refreshToken.repo'
import { hashRefreshToken } from '../utils/tokenHash'
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../utils/jwtToken.ts'
import bcrypt from 'bcryptjs'

function refreshExpiryDate(): Date {
  const days = Number(process.env.REFRESH_TOKEN_EXPIRES_IN || 7)
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d
}

export async function register(params: {
  firstName: string
  lastName?: string | null
  email: string
  password: string
}) {
  const existing = await userRepo.findByEmailWithPassword(params.email.toLowerCase())

  if (existing) throw new Error('Email already in use')

  const passwordHash = await bcrypt.hash(params.password, 10)

  const user = userRepo.create({
    firstName: params.firstName,
    lastName: params.lastName ?? null,
    email: params.email.toLowerCase(),
    password: passwordHash,
    isActive: true,
  })

  const saved = await userRepo.save(user)
  return {
    id: saved.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  }
}

export async function login(params: {
  email: string
  password: string
  userAgent?: string | null
  ip?: string | null
}) {
  const normalizedEmail = params.email.toLowerCase().trim()

  const userWithPassword = await userRepo.findByEmailWithPassword(normalizedEmail)

  if (!userWithPassword) {
    throw new Error('Invalid credentials')
  }

  if (!userWithPassword.isActive) {
    throw new Error('Account is inactive')
  }

  const isPasswordValid = await bcrypt.compare(
    params.password,
    userWithPassword.password
  )

  if (!isPasswordValid) {
    throw new Error('Invalid credentials')
  }

  const refreshSession = RefreshTokenRepo.create({
    userId: userWithPassword.id,
    tokenHash: 'TEMP',
    expiresAt: refreshExpiryDate(),
    revokedAt: null,
    userAgent: params.userAgent ?? null,
    ip: params.ip ?? null,
  })

  const savedRefreshSession = await RefreshTokenRepo.save(refreshSession)

  const refreshToken = signRefreshToken({
    id: userWithPassword.id,
    tokenId: savedRefreshSession.id,
  })

  savedRefreshSession.tokenHash = hashRefreshToken(refreshToken)
  await RefreshTokenRepo.save(savedRefreshSession)

  const accessToken = signAccessToken({
    id: userWithPassword.id,
    role: userWithPassword.role,
  })

  return { accessToken, refreshToken }
}

export async function refreshRotate(params: {
  refreshToken: string
  userAgent?: string | null
  ip?: string | null
}) {
  const payload = verifyRefreshToken(params.refreshToken)
  if (!payload) throw new Error('Invalid or expired refresh token')

  const incomingHash = hashRefreshToken(params.refreshToken)

  return AppDataSource.transaction(async manager => {
    const session = await RefreshTokenRepo.findValidByIdAndHash(
      payload.tokenId,
      incomingHash,
      manager
    )
    if (!session) throw new Error('Refresh token revoked or not found')

    if (session.expiresAt.getTime() < Date.now()) {
      await RefreshTokenRepo.revokeById(session.id, manager)
      throw new Error('Refresh token expired')
    }

    const user = await userRepo.findActiveById(payload.id)
    if (!user) throw new Error('User not found or inactive')

    await RefreshTokenRepo.revokeById(session.id, manager)

    const newSession = RefreshTokenRepo.create(
      {
        userId: user.id,
        tokenHash: 'TEMP',
        expiresAt: refreshExpiryDate(),
        revokedAt: null,
        userAgent: params.userAgent ?? null,
        ip: params.ip ?? null,
      },
      manager
    )
    const savedNew = await RefreshTokenRepo.save(newSession, manager)

    const newRefreshToken = signRefreshToken({ id: user.id, tokenId: savedNew.id })
    savedNew.tokenHash = hashRefreshToken(newRefreshToken)
    await RefreshTokenRepo.save(savedNew, manager)

    const newAccessToken = signAccessToken({ id: user.id, role: (user as any).role })
    return { accessToken: newAccessToken, refreshToken: newRefreshToken }
  })
}

export async function logout(params: { refreshToken: string }) {
  const payload = verifyRefreshToken(params.refreshToken)
  if (!payload) return

  const tokenHash = hashRefreshToken(params.refreshToken)

  const session = await RefreshTokenRepo.findValidByIdAndHash(
    payload.tokenId,
    tokenHash
  )
  if (!session) return

  await RefreshTokenRepo.revokeById(session.id)
}

export async function logoutAll(params: { userId: string }) {
  await RefreshTokenRepo.revokeAllForUser(params.userId)
}
