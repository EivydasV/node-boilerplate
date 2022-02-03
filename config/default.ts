export default {
  port: process.env.PORT,
  logLevel: 'info',
  mongoUri: process.env.MONGO_URI,
  jwtPublicKey: process.env.JWT_PUBLIC_KEY,
  jwtPrivateKey: process.env.JWT_PRIVATE_KEY,
  smpt: {
    user: 'kgeq6bfnhc2blgsr@ethereal.email',
    pass: 'VMunvWy3xnBJvWMWr6',
    host: 'smtp.ethereal.email',
    from: 'test@gmail.com',
    port: 587,
    secure: false,
  },
}
