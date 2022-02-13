import mailer, { SendMailOptions } from 'nodemailer'
import config from 'config'
import log from './logger'

interface Ismpt {
  user: string
  pass: string
  host: string
  port: number
  secure: boolean
  from: string
}
const smpt = config.get<Ismpt>('smpt')

const transporter = mailer.createTransport({
  ...smpt,
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: smpt.user,
    pass: smpt.pass,
  },
})
const sendEmail = async (payload: SendMailOptions) => {
  const send = await transporter.sendMail(payload)

  log.info(`Preview URL: ${mailer.getTestMessageUrl(send)}`)
}

export default sendEmail
