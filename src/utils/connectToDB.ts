import mongoose from 'mongoose'
import config from 'config'
import log from './logger'

async function connectToDb() {
  const dbUri = config.get<string>('mongoUri')

  try {
    await mongoose.connect(dbUri)
    log.info('connected to mongoDB')
  } catch (e) {
    process.exit(1)
  }
}

export default connectToDb
