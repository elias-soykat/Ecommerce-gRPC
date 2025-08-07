require('dotenv').config();

module.exports = {
  port: process.env.PORT || 50051,
  db: {
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'ecommerce',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    dialect: 'postgres',
    logging: false,
  },
  jwtSecret: process.env.JWT_SECRET || 'supersecret',
};