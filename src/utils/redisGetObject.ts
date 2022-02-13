import redis from './redis'
const redisGetObject = async <T>(key: string): Promise<T | null> => {
  let data = await redis.get(key)
  if (data) {
    return (data = JSON.parse(data))
  }
  return null
}
export default redisGetObject
