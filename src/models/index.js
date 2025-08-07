const { Sequelize } = require('sequelize');
const config = require('../config');

const sequelize = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  {
    host: config.db.host,
    dialect: config.db.dialect,
    logging: config.db.logging
  }
);

const User = require('./user')(sequelize);
const Product = require('./product')(sequelize);
const Order = require('./order')(sequelize);

// Relations
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  Product,
  Order
};