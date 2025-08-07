const userService = require("../services/userService");

class UserController {
  /**
   * Handle user registration
   * @param {Object} call - gRPC call object
   * @param {Function} callback - gRPC callback function
   */
  async register(call, callback) {
    try {
      const { email, password } = call.request;

      // Validate input
      if (!email || !password) {
        return callback({
          code: 3, // INVALID_ARGUMENT
          message: "Email and password are required",
        });
      }

      const userData = { email, password };
      const user = await userService.register(userData);

      callback(null, {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
      });
    } catch (error) {
      console.error("Registration error:", error.message);
      callback({
        code: 13, // INTERNAL
        message: error.message,
      });
    }
  }

  /**
   * Handle user login
   * @param {Object} call - gRPC call object
   * @param {Function} callback - gRPC callback function
   */
  async login(call, callback) {
    try {
      const { email, password } = call.request;

      // Validate input
      if (!email || !password) {
        return callback({
          code: 3, // INVALID_ARGUMENT
          message: "Email and password are required",
        });
      }

      const credentials = { email, password };
      const result = await userService.login(credentials);

      callback(null, {
        user: {
          id: result.user.id,
          email: result.user.email,
          created_at: result.user.created_at,
          updated_at: result.user.updated_at,
        },
        token: result.token,
      });
    } catch (error) {
      console.error("Login error:", error.message);
      callback({
        code: 16, // UNAUTHENTICATED
        message: error.message,
      });
    }
  }

  /**
   * Handle get user by ID
   * @param {Object} call - gRPC call object
   * @param {Function} callback - gRPC callback function
   */
  async getUser(call, callback) {
    try {
      const { id } = call.request;

      // Validate input
      if (!id) {
        return callback({
          code: 3, // INVALID_ARGUMENT
          message: "User ID is required",
        });
      }

      const user = await userService.getUserById(id);

      callback(null, {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
      });
    } catch (error) {
      console.error("Get user error:", error.message);
      callback({
        code: 5, // NOT_FOUND
        message: error.message,
      });
    }
  }
}

module.exports = new UserController();
