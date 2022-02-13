import { signJWT } from './../utils/jwt'
import { RequestHandler } from 'express'
import redis from '../utils/redis'
import { verifyJWT } from '../utils/jwt'
import moment from 'moment'
import redisGetObject from '../utils/redisGetObject'
import { RedisUser } from '../types/redisTypes'
import { JWTVerify } from '../types/jwtPayload'

const deserializeUser: RequestHandler = async (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies

  if (!accessToken) return next()
  const { payload, expired } = verifyJWT(accessToken, 'accessToken')
  console.log(payload)

  if (payload) {
    res.locals.user = payload
    return next()
  }

  const refresh: JWTVerify =
    expired && refreshToken && verifyJWT(refreshToken, 'refreshToken')

  if (!refresh.payload) return next()

  const user = await redisGetObject<RedisUser>(`user:${refresh.payload.id}`)
  if (!user?.refreshToken) return next()

  const newAccessToken = signJWT({ id: user._id }, 'accessToken')

  res.locals.user = verifyJWT(newAccessToken, 'accessToken').payload

  res.cookie('accessToken', newAccessToken, {
    httpOnly: true,
    expires: moment().add('1', 'years').toDate(),
    sameSite: 'lax',
    signed: true,
  })
  console.log('new access token')

  return next()
}
export default deserializeUser
