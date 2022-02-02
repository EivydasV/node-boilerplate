import express from 'express'
import {
  createUserHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
} from '../controllers/user.controller'
import validateResource from '../middlewares/validateResource'
import {
  createUserValidation,
  ForgotPasswordUserValidation,
  ResetPasswordUserValidation,
} from '../validation/user.validation'

const router = express.Router()

router.get('/', (_, res) => res.sendStatus(200))

router.post(
  '/forgot-password',
  validateResource(ForgotPasswordUserValidation),
  forgotPasswordHandler
)
router.post(
  '/reset-password/:id/:passwordResetToken',
  validateResource(ResetPasswordUserValidation),
  resetPasswordHandler
)
router
  .route('/')
  .post(validateResource(createUserValidation), createUserHandler)

export default router
