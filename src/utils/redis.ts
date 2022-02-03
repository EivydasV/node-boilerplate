import { createNodeRedisClient } from 'handy-redis'

const client = createNodeRedisClient({
  enable_offline_queue: false,
  host: 'redis',
  port: 6379,
})
client.nodeRedis.on('ready', () => console.log('connected to redis'))
client.nodeRedis.on('error', (err: Error) => {
  console.log(err)
  throw { err }
})

export default { redis: client }
