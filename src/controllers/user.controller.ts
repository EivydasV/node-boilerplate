import createError from 'http-errors'
import { RequestHandler } from 'express'
import UserModel from '../models/user.model'
import { CreateUserInput } from '../validation/user.validation'
import _ from 'lodash'

export const createUserHandler: RequestHandler<
  {},
  {},
  CreateUserInput
> = async (req, res, next) => {
  // console.log(req.body)
  const { email, firstName, lastName, password } = req.body
  return next(createError(400, 'A boom'))
  // const newUser = await UserModel.create({
  //   email,
  //   firstName,
  //   lastName,
  //   password,
  // })

  // res.status(201).json({ user: _.omit(newUser.toJSON(), 'password') })
}
