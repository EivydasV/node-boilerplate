import createError from 'http-errors'
import { RequestHandler } from 'express'
import redisGetObject from '../utils/redisGetObject'
import { RedisUser } from '../types/redisTypes'

const requireUser: RequestHandler = async (req, res, next) => {
  if (!res.locals.user) {
    res.clearCookie('accessToken').clearCookie('refreshToken')
    return next(new createError.Unauthorized())
  }
  const user = await redisGetObject<RedisUser>(`user:${res.locals.user.id}`)
  if (!user?.refreshToken) {
    res.clearCookie('accessToken').clearCookie('refreshToken')
    return next(new createError.Unauthorized())
  }

  return next()
}
export default requireUser
