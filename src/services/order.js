const { Order, User, Product } = require('../models');

module.exports = {
  PlaceOrder: async (call, callback) => {
    try {
      const { userId, productIds } = call.request;
      // Optionally: Check user exists
      const user = await User.findByPk(userId);
      if (!user) return callback({ code: 5, message: 'User not found' });

      // Optionally: Check all products exist and are in stock
      const products = await Product.findAll({ where: { id: productIds } });
      if (products.length !== productIds.length) {
        return callback({ code: 5, message: 'Some products not found' });
      }
      // Decrement stock for each product
      for (let product of products) {
        if (product.stock <= 0) return callback({ code: 9, message: 'Out of stock' });
        product.stock -= 1;
        await product.save();
      }

      const order = await Order.create({
        userId,
        productIds,
        status: 'placed'
      });

      callback(null, {
        id: order.id,
        userId: order.userId,
        productIds: order.productIds,
        status: order.status
      });
    } catch (err) {
      callback({ code: 13, message: err.message });
    }
  },

  TrackOrder: async (call) => {
    try {
      const { orderId } = call.request;
      const order = await Order.findByPk(orderId);
      if (!order) {
        call.emit('error', { code: 5, message: 'Order not found' });
        return call.end();
      }
      // Simulate status updates
      const statuses = ['placed', 'processing', 'shipped', 'delivered'];
      for (let status of statuses) {
        await new Promise(r => setTimeout(r, 1000));
        call.write({ status, timestamp: new Date().toISOString() });
      }
      call.end();
    } catch (err) {
      call.emit('error', { code: 13, message: err.message });
      call.end();
    }
  }
};