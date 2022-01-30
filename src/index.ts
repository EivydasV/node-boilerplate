require('express-async-errors')
require('dotenv').config()
import createError from 'http-errors'
import express, { Response, Request, NextFunction } from 'express'
import config from 'config'
import connectToDB from './utils/connectToDB'
import morgan from 'morgan'
import log from './utils/logger'
import Router from './routes'
import error from './utils/error'
import helmet from 'helmet'
import hpp from 'hpp'
import mongoSanitize from 'express-mongo-sanitize'
import compression from 'compression'
import cors from 'cors'
import cookieParser from 'cookie-parser'
//@ts-ignore
import xss from 'xss-clean'
import path from 'path'

// import connectToDb from './utils/connectToDb'
// import router from './routes'
process.on('uncaughtException', (error) => {
  console.log(error)
  console.log('Uncaught exception! shutting down...')
  process.exit(1)
})
const app = express()

app.use(compression())
app.use(helmet())
app.use(cors({ credentials: true }))
app.use(cookieParser())
app.use(morgan('dev'))
app.use(express.json())
app.use(hpp())
app.use(mongoSanitize())
app.use(xss())
app.use('/public', express.static(path.join(__dirname, 'public')))

app.use('/api/v1', Router)

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new createError.NotFound(`Can't find ${req.originalUrl} on this server`))
})

app.use(error)

const port = config.get<number>('port')
const server = app.listen(port, () => {
  log.info(`App started at http://localhost:${port}`)
  connectToDB()
})
process.on('unhandledRejection', (error: Error) => {
  console.log(error.name, error.message)
  console.log('Unhandled rejection! shutting down...')
  server.close()
  process.exit()
})
