export default {
  port: process.env.PORT,
  logLevel: 'info',
  mongoUri: process.env.MONGO_URI,
  jwtAccessKey: process.env.JWT_ACCESS_TOKEN_SECRET,
  jwtRefreshKey: process.env.JWT_REFRESH_TOKEN_SECRET,
  cookieSecret: process.env.COOKIE_SECRET,
  smpt: {
    user: 'kgeq6bfnhc2blgsr@ethereal.email',
    pass: 'VMunvWy3xnBJvWMWr6',
    host: 'smtp.ethereal.email',
    from: 'test@gmail.com',
    port: 587,
    secure: false,
  },
}
