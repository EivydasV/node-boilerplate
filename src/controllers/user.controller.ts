import createError from 'http-errors'
import { RequestHandler } from 'express'
import UserModel, { User } from '../models/user.model'
import {
  CreateUserInput,
  ForgotPasswordUserInput,
  ResetPasswordUserInput,
} from '../validation/user.validation'
import _ from 'lodash'
import { nanoid } from 'nanoid'
import moment from 'moment'
import timingSafeCompare from 'tsscmp'
import sendEmail from '../utils/mailer'

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

  console.log(newUser)

  res.status(201).json({ user: _.omit(newUser.toJSON(), 'password') })
}
export const forgotPasswordHandler: RequestHandler<
  {},
  {},
  ForgotPasswordUserInput
> = async (req, res, next) => {
  const { email } = req.body
  const user = await UserModel.findOne({ email })
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
  const user = await UserModel.findById(id)

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

  res.sendStatus(200)
}
