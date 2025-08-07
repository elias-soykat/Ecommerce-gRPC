const Order = require('../models/Order');
const userClient = require('../clients/userClient');
const productClient = require('../clients/productClient');

class OrderService {
  /**
   * Create a new order
   * @param {Object} orderData - Order data
   * @returns {Promise<Object>} Created order with user and product info
   */
  async createOrder(orderData) {
    try {
      const { user_id, product_id, quantity } = orderData;

      // Validate input
      if (!user_id || !product_id || !quantity) {
        throw new Error('User ID, product ID, and quantity are required');
      }

      if (quantity <= 0) {
        throw new Error('Quantity must be greater than 0');
      }

      // Check if user exists
      let user;
      try {
        user = await userClient.getUserById(user_id);
      } catch (error) {
        throw new Error('User not found');
      }

      // Check if product exists and has sufficient stock
      let product;
      try {
        product = await productClient.getProductById(product_id);
      } catch (error) {
        throw new Error('Product not found');
      }

      // Check stock availability
      const stockCheck = await productClient.checkStock(product_id, quantity);
      if (!stockCheck.available) {
        throw new Error(`Insufficient stock. Available: ${stockCheck.current_stock}, Requested: ${quantity}`);
      }

      // Calculate total price
      const totalPrice = parseFloat(product.price) * quantity;

      // Create order
      const order = await Order.create({
        user_id,
        product_id,
        quantity,
        total_price: totalPrice,
        status: 'pending'
      });

      // Return order with user and product info
      return {
        id: order.id,
        user_id: order.user_id,
        product_id: order.product_id,
        quantity: order.quantity,
        total_price: parseFloat(order.total_price),
        status: order.status,
        user: {
          id: user.id,
          email: user.email
        },
        product: {
          id: product.id,
          name: product.name,
          price: parseFloat(product.price)
        },
        created_at: order.created_at,
        updated_at: order.updated_at
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get order by ID
   * @param {number} orderId - Order ID
   * @returns {Promise<Object>} Order data with user and product info
   */
  async getOrderById(orderId) {
    try {
      const order = await Order.findByPk(orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      // Get user and product info
      const [user, product] = await Promise.all([
        userClient.getUserById(order.user_id),
        productClient.getProductById(order.product_id)
      ]);

      return {
        id: order.id,
        user_id: order.user_id,
        product_id: order.product_id,
        quantity: order.quantity,
        total_price: parseFloat(order.total_price),
        status: order.status,
        user: {
          id: user.id,
          email: user.email
        },
        product: {
          id: product.id,
          name: product.name,
          price: parseFloat(product.price)
        },
        created_at: order.created_at,
        updated_at: order.updated_at
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * List orders for a user with pagination
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Orders with pagination info
   */
  async listOrders(options = {}) {
    try {
      const { user_id, page = 1, limit = 10 } = options;
      const offset = (page - 1) * limit;

      const whereClause = user_id ? { user_id } : {};

      const { count, rows } = await Order.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });

      // Get user and product info for each order
      const ordersWithDetails = await Promise.all(
        rows.map(async (order) => {
          try {
            const [user, product] = await Promise.all([
              userClient.getUserById(order.user_id),
              productClient.getProductById(order.product_id)
            ]);

            return {
              id: order.id,
              user_id: order.user_id,
              product_id: order.product_id,
              quantity: order.quantity,
              total_price: parseFloat(order.total_price),
              status: order.status,
              user: {
                id: user.id,
                email: user.email
              },
              product: {
                id: product.id,
                name: product.name,
                price: parseFloat(product.price)
              },
              created_at: order.created_at,
              updated_at: order.updated_at
            };
          } catch (error) {
            console.error(`Error fetching details for order ${order.id}:`, error.message);
            // Return order without user/product details if service is unavailable
            return {
              id: order.id,
              user_id: order.user_id,
              product_id: order.product_id,
              quantity: order.quantity,
              total_price: parseFloat(order.total_price),
              status: order.status,
              user: null,
              product: null,
              created_at: order.created_at,
              updated_at: order.updated_at
            };
          }
        })
      );

      return {
        orders: ordersWithDetails,
        total: count,
        page: parseInt(page),
        limit: parseInt(limit)
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update order status
   * @param {number} orderId - Order ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated order
   */
  async updateOrderStatus(orderId, status) {
    try {
      const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        throw new Error('Invalid status. Must be one of: pending, confirmed, shipped, delivered, cancelled');
      }

      const order = await Order.findByPk(orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      await order.updateStatus(status);

      // Get user and product info
      const [user, product] = await Promise.all([
        userClient.getUserById(order.user_id),
        productClient.getProductById(order.product_id)
      ]);

      return {
        id: order.id,
        user_id: order.user_id,
        product_id: order.product_id,
        quantity: order.quantity,
        total_price: parseFloat(order.total_price),
        status: order.status,
        user: {
          id: user.id,
          email: user.email
        },
        product: {
          id: product.id,
          name: product.name,
          price: parseFloat(product.price)
        },
        created_at: order.created_at,
        updated_at: order.updated_at
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new OrderService();
