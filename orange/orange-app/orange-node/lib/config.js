require('dotenv').config();

const config = {
  app: {
    host: process.env.APP_HOST || '0.0.0.0',
    port: process.env.APP_PORT || '9595',
    // storagePath: process.env.STORAGE_PATH || './storage',
    // webUrl: process.env.WEB_URL || '',
  },
  db: {
    host: process.env.PG_HOST || 'localhost',
    port: process.env.PG_PORT || '5433',
    user: process.env.PG_USER || '',
    password: process.env.PG_PASSWORD || 'rlgns123',
    database: process.env.PG_DATABASE || 'red',
    connectionTimeoutMillis: process.env.PG_TIMEOUT || '15000',
    max: process.env.PG_POOL_MAX || '20',
    idleConnectTimeout: process.env.PG_POOL_TIMEOUT || '15000',
    idleTimeoutMillis: process.env.PG_POOL_IDLE_TIMEOUT || '150000',
  },
  auth:{
    jwtSecretUser: process.env.JWT_SECRET_USER || `lsak2jdoa1i8cslmkfsd8mclkzmldkjl15l2ento8wdhvdonlt23mntoprecjg0p3reht230`,
    jwtExpireUser: process.env.JWT_EXPIRE_USER  || `60d`,
    jwtSecretAdmin: process.env.JWT_SECRET_ADMIN || `41sd86h4519trq78bfb23porfvwtfpaas6dcrasd80obrwbrw6d76d7xz98f9sxzdjgdixvzhglgf`,
    jwtExpireAdmin: process.env.JWT_EXPIRE_ADMIN || `1d`
  }
}


module.exports = config;
