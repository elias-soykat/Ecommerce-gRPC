const orderService = require("../services/orderService");

class OrderController {
  /**
   * Handle order creation
   * @param {Object} call - gRPC call object
   * @param {Function} callback - gRPC callback function
   */
  async createOrder(call, callback) {
    try {
      const { user_id, product_id, quantity } = call.request;

      // Validate input
      if (!user_id || !product_id || !quantity) {
        return callback({
          code: 3, // INVALID_ARGUMENT
          message: "User ID, product ID, and quantity are required",
        });
      }

      if (quantity <= 0) {
        return callback({
          code: 3, // INVALID_ARGUMENT
          message: "Quantity must be greater than 0",
        });
      }

      const orderData = { user_id, product_id, quantity };
      const order = await orderService.createOrder(orderData);

      callback(null, {
        id: order.id,
        user_id: order.user_id,
        product_id: order.product_id,
        quantity: order.quantity,
        total_price: order.total_price,
        status: order.status,
        user: order.user,
        product: order.product,
        created_at: order.created_at,
        updated_at: order.updated_at,
      });
    } catch (error) {
      console.error("Create order error:", error.message);
      callback({
        code: 13, // INTERNAL
        message: error.message,
      });
    }
  }

  /**
   * Handle get order by ID
   * @param {Object} call - gRPC call object
   * @param {Function} callback - gRPC callback function
   */
  async getOrder(call, callback) {
    try {
      const { id } = call.request;

      // Validate input
      if (!id) {
        return callback({
          code: 3, // INVALID_ARGUMENT
          message: "Order ID is required",
        });
      }

      const order = await orderService.getOrderById(id);

      callback(null, {
        id: order.id,
        user_id: order.user_id,
        product_id: order.product_id,
        quantity: order.quantity,
        total_price: order.total_price,
        status: order.status,
        user: order.user,
        product: order.product,
        created_at: order.created_at,
        updated_at: order.updated_at,
      });
    } catch (error) {
      console.error("Get order error:", error.message);
      callback({
        code: 5, // NOT_FOUND
        message: error.message,
      });
    }
  }

  /**
   * Handle list orders
   * @param {Object} call - gRPC call object
   * @param {Function} callback - gRPC callback function
   */
  async listOrders(call, callback) {
    try {
      const { user_id, page, limit } = call.request;

      const options = {
        user_id: user_id || null,
        page: page || 1,
        limit: limit || 10,
      };

      const result = await orderService.listOrders(options);

      callback(null, {
        orders: result.orders,
        total: result.total,
        page: result.page,
        limit: result.limit,
      });
    } catch (error) {
      console.error("List orders error:", error.message);
      callback({
        code: 13, // INTERNAL
        message: error.message,
      });
    }
  }

  /**
   * Handle update order status
   * @param {Object} call - gRPC call object
   * @param {Function} callback - gRPC callback function
   */
  async updateOrderStatus(call, callback) {
    try {
      const { id, status } = call.request;

      // Validate input
      if (!id || !status) {
        return callback({
          code: 3, // INVALID_ARGUMENT
          message: "Order ID and status are required",
        });
      }

      const order = await orderService.updateOrderStatus(id, status);

      callback(null, {
        id: order.id,
        user_id: order.user_id,
        product_id: order.product_id,
        quantity: order.quantity,
        total_price: order.total_price,
        status: order.status,
        user: order.user,
        product: order.product,
        created_at: order.created_at,
        updated_at: order.updated_at,
      });
    } catch (error) {
      console.error("Update order status error:", error.message);
      callback({
        code: 5, // NOT_FOUND
        message: error.message,
      });
    }
  }
}

module.exports = new OrderController();
