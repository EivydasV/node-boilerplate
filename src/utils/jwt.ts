import { JWTVerify } from './../types/jwtPayload'
import jwt from 'jsonwebtoken'
import config from 'config'

export const signJWT = (
  payload: { id: string },
  tokenType: 'accessToken' | 'refreshToken'
) => {
  const secret =
    tokenType === 'accessToken'
      ? config.get<string>('jwtAccessKey')
      : config.get<string>('jwtRefreshKey')

  const expiresIn = tokenType === 'accessToken' ? '10s' : '1y'
  return jwt.sign(payload, secret, { expiresIn })
}

export const verifyJWT = (
  token: string,
  tokenType: 'accessToken' | 'refreshToken'
): JWTVerify => {
  try {
    const secret =
      tokenType === 'accessToken'
        ? config.get<string>('jwtAccessKey')
        : config.get<string>('jwtRefreshKey')

    const decoded = jwt.verify(token, secret) as JWTVerify['payload']

    return { expired: false, payload: decoded }
  } catch (err: any) {
    return { expired: err?.name === 'TokenExpiredError', payload: null }
  }
}
