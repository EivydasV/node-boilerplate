import { JwtPayload } from 'jsonwebtoken'
export type JWTVerify = {
  payload: (JwtPayload & { id: string }) | null
  expired: boolean
}
