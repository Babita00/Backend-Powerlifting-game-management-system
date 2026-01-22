import jwt, { type Secret, type SignOptions } from 'jsonwebtoken'

export type AccessPayload = { id: string; role: string }
export type RefreshPayload = { id: string; tokenId: string }

function getSecret(name: string): Secret {
  const value = process.env[name]
  if (!value) throw new Error(`${name} missing`)
  return value
}

export function signAccessToken(payload: AccessPayload): string {
  const secret = getSecret('ACCESS_TOKEN_SECRET')
  const expiresIn = (process.env.ACCESS_TOKEN_EXPIRES_IN ??
    '15m') as SignOptions['expiresIn']

  const options: SignOptions = { expiresIn }
  return jwt.sign(payload, secret, options)
}

export function signRefreshToken(payload: RefreshPayload): string {
  const secret = getSecret('REFRESH_TOKEN_SECRET')
  const expiresIn = (process.env.REFRESH_TOKEN_EXPIRES_IN ??
    '7d') as SignOptions['expiresIn']

  const options: SignOptions = { expiresIn }
  return jwt.sign(payload, secret, options)
}

export function verifyRefreshToken(token: string): RefreshPayload | null {
  try {
    const secret = getSecret('REFRESH_TOKEN_SECRET')
    return jwt.verify(token, secret) as RefreshPayload
  } catch {
    return null
  }
}

export function verifyAccessToken(token: string): AccessPayload | null {
  try {
    const secret = getSecret('ACCESS_TOKEN_SECRET')
    return jwt.verify(token, secret) as AccessPayload
  } catch {
    return null
  }
}
