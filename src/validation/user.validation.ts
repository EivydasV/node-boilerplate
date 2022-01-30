import z, { object, string } from 'zod'
import UserModel from '../models/user.model'
import validator from 'validator'

const firstName = string({
  required_error: 'First Name is required',
  invalid_type_error: 'Invalid type',
})

const lastName = string({
  required_error: 'Last Name is required',
  invalid_type_error: 'Invalid type',
})

const email = string({
  required_error: 'Email is required',
  invalid_type_error: 'Invalid type',
}).email('Please provide a valid email')

const password = string({
  required_error: 'Password is required',
  invalid_type_error: 'Invalid type',
})

const passwordConfirmation = string({
  required_error: 'Password Confimation is required',
  invalid_type_error: 'Invalid type',
})

export const createUserValidation = object({
  body: object({
    firstName,
    email,
    lastName,
    password,
    passwordConfirmation,
  })
    .refine(
      (data) => validator.isStrongPassword(data.password, { minSymbols: 0 }),
      {
        message:
          'password must contain at least one upperCase, one lowerCase, one number and total length must be more than 8 characters long',
        path: ['password'],
      }
    )
    .refine((data) => data.password === data.passwordConfirmation, {
      message: 'Passwords do not match',
      path: ['password', 'passwordConfirmation'],
    })
    .refine(
      async (data) => {
        const user = await UserModel.findOne({ email: data.email }).lean()
        return !!!user
      },
      { message: 'This Email is already taken', path: ['email'] }
    ),
})

export type CreateUserInput = z.infer<typeof createUserValidation>['body']
