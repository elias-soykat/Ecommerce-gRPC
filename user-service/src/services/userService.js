const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

class UserService {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Created user
   */
  async register(userData) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({
        where: { email: userData.email },
      });

      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      // Create new user
      const user = await User.create(userData);
      return user.toPublicJSON();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @returns {Promise<Object>} User data with token
   */
  async login(credentials) {
    try {
      // Find user by email
      const user = await User.findOne({
        where: { email: credentials.email },
      });

      if (!user) {
        throw new Error("Invalid email or password");
      }

      // Check password
      const isValidPassword = await user.comparePassword(credentials.password);
      if (!isValidPassword) {
        throw new Error("Invalid email or password");
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      return {
        user: user.toPublicJSON(),
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user by ID
   * @param {number} userId - User ID
   * @returns {Promise<Object>} User data
   */
  async getUserById(userId) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error("User not found");
      }
      return user.toPublicJSON();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user by ID (for internal service calls)
   * @param {number} userId - User ID
   * @returns {Promise<Object>} User data with minimal info
   */
  async getUserByIdForService(userId) {
    try {
      const user = await User.findByPk(userId, {
        attributes: ["id", "email"],
      });
      if (!user) {
        throw new Error("User not found");
      }
      return user.toJSON();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserService();
