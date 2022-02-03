import mongoose from 'mongoose'
import config from 'config'
import log from './logger'

async function connectToDb() {
  const dbUri = config.get<string>('mongoUri')

  await mongoose.connect(dbUri)
  log.info('connected to mongoDB')
}

export default connectToDb
