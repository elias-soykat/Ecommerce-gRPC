const productService = require("../services/productService");

class ProductController {
  /**
   * Handle product creation
   * @param {Object} call - gRPC call object
   * @param {Function} callback - gRPC callback function
   */
  async createProduct(call, callback) {
    try {
      const { name, price, stock } = call.request;

      // Validate input
      if (!name || price === undefined || stock === undefined) {
        return callback({
          code: 3, // INVALID_ARGUMENT
          message: "Name, price, and stock are required",
        });
      }

      if (price < 0 || stock < 0) {
        return callback({
          code: 3, // INVALID_ARGUMENT
          message: "Price and stock must be non-negative",
        });
      }

      const productData = { name, price, stock };
      const product = await productService.createProduct(productData);

      callback(null, {
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        stock: product.stock,
        created_at: product.created_at,
        updated_at: product.updated_at,
      });
    } catch (error) {
      console.error("Create product error:", error.message);
      callback({
        code: 13, // INTERNAL
        message: error.message,
      });
    }
  }

  /**
   * Handle get product by ID
   * @param {Object} call - gRPC call object
   * @param {Function} callback - gRPC callback function
   */
  async getProduct(call, callback) {
    try {
      const { id } = call.request;

      // Validate input
      if (!id) {
        return callback({
          code: 3, // INVALID_ARGUMENT
          message: "Product ID is required",
        });
      }

      const product = await productService.getProductById(id);

      callback(null, {
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        stock: product.stock,
        created_at: product.created_at,
        updated_at: product.updated_at,
      });
    } catch (error) {
      console.error("Get product error:", error.message);
      callback({
        code: 5, // NOT_FOUND
        message: error.message,
      });
    }
  }

  /**
   * Handle list products
   * @param {Object} call - gRPC call object
   * @param {Function} callback - gRPC callback function
   */
  async listProducts(call, callback) {
    try {
      const { page, limit } = call.request;

      const options = {
        page: page || 1,
        limit: limit || 10,
      };

      const result = await productService.listProducts(options);

      callback(null, {
        products: result.products.map((product) => ({
          id: product.id,
          name: product.name,
          price: parseFloat(product.price),
          stock: product.stock,
          created_at: product.created_at,
          updated_at: product.updated_at,
        })),
        total: result.total,
        page: result.page,
        limit: result.limit,
      });
    } catch (error) {
      console.error("List products error:", error.message);
      callback({
        code: 13, // INTERNAL
        message: error.message,
      });
    }
  }

  /**
   * Handle update product
   * @param {Object} call - gRPC call object
   * @param {Function} callback - gRPC callback function
   */
  async updateProduct(call, callback) {
    try {
      const { id, name, price, stock } = call.request;

      // Validate input
      if (!id) {
        return callback({
          code: 3, // INVALID_ARGUMENT
          message: "Product ID is required",
        });
      }

      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (price !== undefined) updateData.price = price;
      if (stock !== undefined) updateData.stock = stock;

      const product = await productService.updateProduct(id, updateData);

      callback(null, {
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        stock: product.stock,
        created_at: product.created_at,
        updated_at: product.updated_at,
      });
    } catch (error) {
      console.error("Update product error:", error.message);
      callback({
        code: 5, // NOT_FOUND
        message: error.message,
      });
    }
  }

  /**
   * Handle delete product
   * @param {Object} call - gRPC call object
   * @param {Function} callback - gRPC callback function
   */
  async deleteProduct(call, callback) {
    try {
      const { id } = call.request;

      // Validate input
      if (!id) {
        return callback({
          code: 3, // INVALID_ARGUMENT
          message: "Product ID is required",
        });
      }

      await productService.deleteProduct(id);

      callback(null, {
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      console.error("Delete product error:", error.message);
      callback({
        code: 5, // NOT_FOUND
        message: error.message,
      });
    }
  }

  /**
   * Handle check stock
   * @param {Object} call - gRPC call object
   * @param {Function} callback - gRPC callback function
   */
  async checkStock(call, callback) {
    try {
      const { product_id, quantity } = call.request;

      // Validate input
      if (!product_id || quantity === undefined) {
        return callback({
          code: 3, // INVALID_ARGUMENT
          message: "Product ID and quantity are required",
        });
      }

      const result = await productService.checkStock(product_id, quantity);

      callback(null, {
        available: result.available,
        current_stock: result.current_stock,
        message: result.message,
      });
    } catch (error) {
      console.error("Check stock error:", error.message);
      callback({
        code: 13, // INTERNAL
        message: error.message,
      });
    }
  }
}

module.exports = new ProductController();
