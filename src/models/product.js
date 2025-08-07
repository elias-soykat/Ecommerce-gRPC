const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Product = sequelize.define('Product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DOUBLE, allowNull: false },
    stock: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    tableName: 'products',
    timestamps: false
  });
  return Product;
};