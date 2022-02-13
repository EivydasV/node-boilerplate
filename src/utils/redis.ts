import Redis from 'ioredis'
import log from './logger'
const redis = new Redis(6379, 'redis')

redis.on('ready', () => log.info('Conected to Redis'))
export default redis
