import express from 'express'
import userRoutes from './user.routes'

const router = express.Router()

router.get('/healthcheck', (_, res) => res.sendStatus(200))

router.use('/user', userRoutes)

export default router
