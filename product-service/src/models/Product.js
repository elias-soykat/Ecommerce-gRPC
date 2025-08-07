const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 255] // Name must be between 1 and 255 characters
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0 // Price must be non-negative
    }
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0 // Stock must be non-negative
    }
  }
}, {
  tableName: 'products',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Instance method to check if product is in stock
Product.prototype.isInStock = function(quantity = 1) {
  return this.stock >= quantity;
};

// Instance method to decrease stock
Product.prototype.decreaseStock = async function(quantity) {
  if (this.stock < quantity) {
    throw new Error('Insufficient stock');
  }
  this.stock -= quantity;
  return await this.save();
};

// Instance method to increase stock
Product.prototype.increaseStock = async function(quantity) {
  this.stock += quantity;
  return await this.save();
};

module.exports = Product;
