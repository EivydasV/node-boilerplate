import { User } from '../models/user.model'

export type RedisUser = Omit<User, 'comparePassword'> & {
  refreshToken: string
  _id: string
}
