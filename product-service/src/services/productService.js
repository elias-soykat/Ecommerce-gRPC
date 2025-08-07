const Product = require('../models/Product');
const { Op } = require('sequelize');

class ProductService {
  /**
   * Create a new product
   * @param {Object} productData - Product data
   * @returns {Promise<Object>} Created product
   */
  async createProduct(productData) {
    try {
      const product = await Product.create(productData);
      return product.toJSON();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get product by ID
   * @param {number} productId - Product ID
   * @returns {Promise<Object>} Product data
   */
  async getProductById(productId) {
    try {
      const product = await Product.findByPk(productId);
      if (!product) {
        throw new Error('Product not found');
      }
      return product.toJSON();
    } catch (error) {
      throw error;
    }
  }

  /**
   * List products with pagination
   * @param {Object} options - Pagination options
   * @returns {Promise<Object>} Products with pagination info
   */
  async listProducts(options = {}) {
    try {
      const { page = 1, limit = 10 } = options;
      const offset = (page - 1) * limit;

      const { count, rows } = await Product.findAndCountAll({
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });

      return {
        products: rows.map(product => product.toJSON()),
        total: count,
        page: parseInt(page),
        limit: parseInt(limit)
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update product
   * @param {number} productId - Product ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated product
   */
  async updateProduct(productId, updateData) {
    try {
      const product = await Product.findByPk(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      await product.update(updateData);
      return product.toJSON();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete product
   * @param {number} productId - Product ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteProduct(productId) {
    try {
      const product = await Product.findByPk(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      await product.destroy();
      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check product stock availability
   * @param {number} productId - Product ID
   * @param {number} quantity - Required quantity
   * @returns {Promise<Object>} Stock check result
   */
  async checkStock(productId, quantity) {
    try {
      const product = await Product.findByPk(productId);
      if (!product) {
        return {
          available: false,
          current_stock: 0,
          message: 'Product not found'
        };
      }

      const isAvailable = product.isInStock(quantity);
      return {
        available: isAvailable,
        current_stock: product.stock,
        message: isAvailable ? 'Stock available' : 'Insufficient stock'
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Decrease product stock (for order processing)
   * @param {number} productId - Product ID
   * @param {number} quantity - Quantity to decrease
   * @returns {Promise<Object>} Updated product
   */
  async decreaseStock(productId, quantity) {
    try {
      const product = await Product.findByPk(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      await product.decreaseStock(quantity);
      return product.toJSON();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ProductService();
