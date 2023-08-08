module.exports = {
    port: process.env.PORT || 3000,
    db: {
      database: process.env.DB_NAME || 'viscussion', //database name
      user: process.env.DB_USER || 'viscussion',
      password: process.env.DB_USER || 'viscussion',
      options: {
        dialect: process.env.DIALECT || 'sqlite',
        host: process.env.HOST || 'localhost',
        storage: process.env.STORAGE || './viscussion.sqlite',
        //logging: false
      }
    }
  }
  