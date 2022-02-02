import createError from 'http-errors'
import { createUserValidation } from './../validation/user.validation'
import { RequestHandler } from 'express'
import { AnyZodObject } from 'zod'
import log from '../utils/logger'
const validateResource =
  (schema: AnyZodObject): RequestHandler =>
  async (req, res, next) => {
    const validate = await schema.safeParseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    })
    if (!validate.success) {
      // throw 'error'
      return next(createError(422, validate.error))
    }
    next()
  }
export default validateResource
