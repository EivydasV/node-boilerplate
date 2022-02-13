import express from 'express'
import CheckInCache from '../utils/checkInCacheForUser'
import {
  createUserHandler,
  forgotPasswordHandler,
  getAllUsers,
  GetUserById,
  resetPasswordHandler,
  UpdateEmail,
  updatePassword,
} from '../controllers/user.controller'
import validateResource from '../middlewares/validateResource'
import {
  createUserValidation,
  ForgotPasswordUserValidation,
  ResetPasswordUserValidation,
  loginUserValidation,
  updatePasswordUserValidation,
  updateEmailUserValidation,
} from '../validation/user.validation'
import requireUser from '../middlewares/requireUser'
import { login, logout, me } from '../controllers/auth.controller'

const router = express.Router()

router.get('/me', requireUser, me)
router.post('/login', validateResource(loginUserValidation), login)
router.delete('/logout', logout)

router.post(
  '/forgot-password',
  validateResource(ForgotPasswordUserValidation),
  forgotPasswordHandler
)
router.put(
  '/update-password',
  requireUser,
  validateResource(updatePasswordUserValidation),
  updatePassword
)
router.put(
  '/update-email',
  requireUser,
  validateResource(updateEmailUserValidation),
  UpdateEmail
)

router.get('/:id', CheckInCache('user'), GetUserById)

router.post(
  '/reset-password/:id/:passwordResetToken',
  validateResource(ResetPasswordUserValidation),
  resetPasswordHandler
)
router
  .route('/')
  .post(validateResource(createUserValidation), createUserHandler)
  .get(getAllUsers)

export default router
