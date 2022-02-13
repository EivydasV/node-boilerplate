import { RedisUser } from './../types/redisTypes'
import createError from 'http-errors'
import { RequestHandler } from 'express'
import redis from './redis'
import _ from 'lodash'
import redisGetObject from './redisGetObject'
import log from './logger'

const CheckInCache =
  (prefix: string): RequestHandler =>
  async (req, res, next) => {
    let cache = await redisGetObject(`${prefix}:${req.params?.id}`)
    if (cache) {
      log.info('Cache hit')
      if (prefix === 'user') cache = _.omit(cache as object, 'refreshToken')
      res.locals.cache = cache
    }
    return next()
  }
export default CheckInCache
