import express from 'express'
import { createUserHandler } from '../controllers/user.controller'
import validateResource from '../middlewares/validateResource'
import { createUserValidation } from '../validation/user.validation'

const router = express.Router()

router.get('/', (_, res) => res.sendStatus(200))

router
  .route('/')
  .post(validateResource(createUserValidation), createUserHandler)

export default router
