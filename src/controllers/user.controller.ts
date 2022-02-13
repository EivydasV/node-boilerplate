import {
  UpdateEmailUserInput,
  UpdatePasswordUserInput,
} from './../validation/user.validation'
import createError from 'http-errors'
import { RequestHandler } from 'express'
import UserModel from '../models/user.model'
import {
  CreateUserInput,
  ForgotPasswordUserInput,
  ResetPasswordUserInput,
  GetByIdUserInput,
} from '../validation/user.validation'
import _ from 'lodash'
import { nanoid } from 'nanoid'
import moment from 'moment'
import timingSafeCompare from 'tsscmp'
import sendEmail from '../utils/mailer'
import redis from '../utils/redis'
import redisGetObject from '../utils/redisGetObject'
import { RedisUser } from '../types/redisTypes'

export const createUserHandler: RequestHandler<
  {},
  {},
  CreateUserInput
> = async (req, res, next) => {
  const { email, firstName, lastName, password } = req.body
  const newUser = await UserModel.create({
    email,
    firstName,
    lastName,
    password,
  })
  res.status(201).json({ user: _.omit(newUser.toJSON(), 'password') })
}
export const forgotPasswordHandler: RequestHandler<
  {},
  {},
  ForgotPasswordUserInput
> = async (req, res, next) => {
  const { email } = req.body
  const user = await UserModel.findOne({ email }).select(
    'passwordResetToken passwordResetTokenExpires email'
  )
  if (user) {
    user.passwordResetToken = nanoid(64)
    user.passwordResetTokenExpires = moment().add(2, 'hours').toDate()

    const savedUser = await user.save()

    await sendEmail({
      to: user.email,
      subject: 'Reset password',
      text: `Password reset token: ${savedUser.passwordResetToken}. ID: ${savedUser._id}`,
    })
  }
  res.sendStatus(200)
}
export const resetPasswordHandler: RequestHandler<
  ResetPasswordUserInput['params'],
  {},
  ResetPasswordUserInput['body']
> = async (req, res, next) => {
  const { password } = req.body
  const { id, passwordResetToken } = req.params
  const user = await UserModel.findById(id).select(
    'passwordResetToken passwordResetTokenExpires password'
  )

  if (
    !user ||
    !user.passwordResetToken ||
    !user.passwordResetTokenExpires ||
    user.passwordResetTokenExpires < moment().toDate() ||
    !timingSafeCompare(user.passwordResetToken, passwordResetToken)
  ) {
    return next(new createError.BadRequest('could not reset password'))
  }
  user.passwordResetToken = undefined
  user.passwordResetTokenExpires = undefined
  user.password = password
  await user.save()
  console.log({ user })

  await redis.del(`user:${user._id}`)

  res.status(200).json({ message: 'Password successfully updated' })
}
export const GetUserById: RequestHandler<GetByIdUserInput> = async (
  req,
  res,
  next
) => {
  const user =
    res.locals.cache || (await UserModel.findById(req.params.id).lean())
  if (!user) {
    return next(new createError.NotFound('User not found'))
  }
  res.status(200).json({ user })
}
export const updatePassword: RequestHandler<
  {},
  {},
  UpdatePasswordUserInput
> = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body

  const user = await UserModel.findById(res.locals.user?.id).select('password')
  if (!user) return next(new createError.NotFound('User not found'))

  if (!(await user.comparePassword(currentPassword)))
    return next(new createError.BadRequest('Wrong current password'))

  user.password = newPassword
  await user.save()
  res.status(200).json({ message: 'Password successfully updated' })
}
export const UpdateEmail: RequestHandler<{}, {}, UpdateEmailUserInput> = async (
  req,
  res,
  next
) => {
  const { currentPassword, newEmail } = req.body

  const user = await UserModel.findById(res.locals.user?.id).select(
    'password email'
  )
  if (!user) return next(new createError.NotFound('User not found'))

  if (!(await user.comparePassword(currentPassword)))
    return next(new createError.BadRequest('Wrong current password'))

  user.email = newEmail
  await user.save()
  const redisUser = await redisGetObject<RedisUser>(`user:${user._id}`)
  if (redisUser) {
    redisUser.email = newEmail

    await redis.setex(`user:${user._id}`, 31556926, JSON.stringify(redisUser))
  }
  console.log({ redis: redisUser })

  res.status(200).json({ message: 'Email successfully updated' })
}
export const getAllUsers: RequestHandler = async (req, res, next) => {
  const users = await UserModel.find({}).lean()
  if (!users) return next(new createError.NotFound('Users not found'))

  res.status(200).json({ users })
}
