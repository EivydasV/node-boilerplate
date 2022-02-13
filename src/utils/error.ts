import mongoose from 'mongoose'
// import multer from 'multer'
import { Response, Request, NextFunction, ErrorRequestHandler } from 'express'
import createError, { HttpError } from 'http-errors'
import { ZodError } from 'zod'
import log from './logger'

const handleCastErrorDB = () => {
  return new createError.NotFound('Invalid Id')
}
const handleDuplicateError = () => {
  return new createError.Conflict('Duplicate field values')
}
const handleValidationError = (
  error: mongoose.Error.ValidationError,
  res: Response
) => {
  const formattedError = Object.values(error.errors)
  // .map((err: any) => ({
  //   message: err.message,
  //   field: err.path,
  //   value: err.value ?? '',
  // }))
  // .reduce((obj, cur) => ({ ...obj, [cur.field]: cur }), {})

  return createError(422, 'Invalid field values')
  //   return res
  //     .status(422)
  //     .json({ status: 'fail', error: { validationErrors: formattedError } })
}
const handleJWTError = (res: Response) => {
  res.clearCookie('jwtAccessToken').clearCookie('jwtRefreshToken')
  return new createError.Unauthorized('Invalid token please log in again')
}
const handleCSRFError = (error: { message: string }) =>
  new createError.Forbidden('Invalid CSRF token')

// const handleMulterError = (error: Error) => {
//   console.log(error)
//   return new AppError(error.message, 400)
// }
const handleAuthenticationError = () => {
  return new createError.Unauthorized('unauthenticated')
}
const handleZodError = (err: ZodError) => {
  return createError(422, err.format())
}
export default (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof mongoose.Error.CastError) err = handleCastErrorDB()
  if (err instanceof ZodError) err = handleZodError(err)
  if (err.code === 11000) err = handleDuplicateError()
  if (err instanceof mongoose.Error.ValidationError)
    err = handleValidationError(err, res)
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError')
    err = handleJWTError(res)
  if (err.name === 'AuthenticationError') err = handleAuthenticationError
  if (err.name === 'EBADCSRFTOKEN') err = handleCSRFError(err)
  // if (err instanceof multer.MulterError) error = handleMulterError(error)
  // if (err.name === "Error") error = handleRedisError(error);

  if (!(err instanceof createError.HttpError)) {
    console.log({ err })

    err = new createError.InternalServerError()
  }
  return res.status(err.statusCode).json(err)
}
