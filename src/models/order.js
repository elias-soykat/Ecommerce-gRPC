const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Order = sequelize.define('Order', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    productIds: { type: DataTypes.JSON, allowNull: false }, // Array of IDs
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'pending' }
  }, {
    tableName: 'orders',
    timestamps: false
  });
  return Order;
};