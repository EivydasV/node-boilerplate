import express from 'express'
import { createUserHandler } from '../controllers/user.controller'
import log from '../utils/logger'
import userRoutes from './user.routes'
// import authRoutes from './auth.routes'
const router = express.Router()

router.get('/healthcheck', (_, res) => res.sendStatus(200))

router.use('/user', userRoutes)
// router.use('/auth', authRoutes)

export default router
