const { Sequelize } = require("sequelize");

// Database configuration
const sequelize = new Sequelize(
  process.env.DB_NAME || "product_db",
  process.env.DB_USER || "postgres",
  process.env.DB_PASSWORD || "password",
  {
    host: process.env.DB_HOST || "postgres-product",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: false, // Set to console.log to see SQL queries
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log(
      "✅ Product Service: Database connection established successfully."
    );
  } catch (error) {
    console.error(
      "❌ Product Service: Unable to connect to the database:",
      error
    );
    process.exit(1);
  }
};

module.exports = { sequelize, testConnection };
