const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

// Load user service proto
const USER_PROTO_PATH = path.join(__dirname, "..", "proto", "user.proto");

const userPackageDefinition = protoLoader.loadSync(USER_PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const userProto = grpc.loadPackageDefinition(userPackageDefinition).user;

class UserClient {
  constructor() {
    const userServiceHost = process.env.USER_SERVICE_HOST || "user-service";
    const userServicePort = process.env.USER_SERVICE_PORT || 50051;

    this.client = new userProto.UserService(
      `${userServiceHost}:${userServicePort}`,
      grpc.credentials.createInsecure()
    );
  }

  /**
   * Get user by ID
   * @param {number} userId - User ID
   * @returns {Promise<Object>} User data
   */
  async getUserById(userId) {
    return new Promise((resolve, reject) => {
      this.client.getUser({ id: userId }, (error, response) => {
        if (error) {
          console.error("User service error:", error.message);
          reject(new Error(`Failed to get user: ${error.message}`));
        } else {
          resolve(response);
        }
      });
    });
  }
}

module.exports = new UserClient();
