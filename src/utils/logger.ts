import logger from 'pino'
import config from 'config'

const level = config.get<string>('logLevel')

const log = logger({
  transport: {
    target: 'pino-pretty',
  },
  level,
  base: {
    pid: false,
  },
  //   timestamp: () => 'time: ' + moment().format(),
})

export default log
