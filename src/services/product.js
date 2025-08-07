const { Product } = require('../models');

module.exports = {
  CreateProduct: async (call, callback) => {
    try {
      const { name, description, price, stock } = call.request;
      const product = await Product.create({ name, description, price, stock });
      callback(null, {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock
      });
    } catch (err) {
      callback({ code: 13, message: err.message });
    }
  },

  GetProduct: async (call, callback) => {
    try {
      const { id } = call.request;
      const product = await Product.findByPk(id);
      if (!product) {
        return callback({ code: 5, message: 'Product not found' });
      }
      callback(null, {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock
      });
    } catch (err) {
      callback({ code: 13, message: err.message });
    }
  },

  UpdateProduct: async (call, callback) => {
    try {
      const { id, name, description, price, stock } = call.request;
      const product = await Product.findByPk(id);
      if (!product) {
        return callback({ code: 5, message: 'Product not found' });
      }
      await product.update({ name, description, price, stock });
      callback(null, {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock
      });
    } catch (err) {
      callback({ code: 13, message: err.message });
    }
  },

  DeleteProduct: async (call, callback) => {
    try {
      const { id } = call.request;
      const product = await Product.findByPk(id);
      if (!product) {
        return callback({ code: 5, message: 'Product not found' });
      }
      await product.destroy();
      callback(null, { message: 'Product deleted' });
    } catch (err) {
      callback({ code: 13, message: err.message });
    }
  },

  BulkCreateProducts: async (call, callback) => {
    let count = 0;
    call.on('data', async (data) => {
      try {
        await Product.create({
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock
        });
        count++;
      } catch (err) {
        // Skip on error, could accumulate errors if needed
      }
    });
    call.on('end', () => {
      callback(null, { createdCount: count });
    });
  }
};