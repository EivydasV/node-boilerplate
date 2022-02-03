import jwt from 'jsonwebtoken'
import config from 'config'
const signJWT = (payload: object, expiresIn: string | number) => {
  jwt.sign(payload, config.get<string>('jwtPrivateKey'), { expiresIn })
}

const verifyJWT = (token: string) => {
  const decoded = jwt.verify(token, config.get<string>('jwtPublicKey'))
}
