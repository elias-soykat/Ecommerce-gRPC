const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const { testConnection, sequelize } = require("./db");
const User = require("./models/User");
const userController = require("./controllers/userController");

// Load proto file
const PROTO_PATH = path.join(__dirname, "proto", "user.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const userProto = grpc.loadPackageDefinition(packageDefinition).user;

// Initialize database and start server
async function startServer() {
  try {
    // Test database connection
    await testConnection();

    // Sync database (create tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log("✅ User Service: Database synchronized successfully.");

    // Create gRPC server
    const server = new grpc.Server();

    // Add service to server
    server.addService(userProto.UserService.service, {
      register: userController.register,
      login: userController.login,
      getUser: userController.getUser,
    });

    // Start server
    const port = process.env.PORT || 50051;
    server.bindAsync(
      `0.0.0.0:${port}`,
      grpc.ServerCredentials.createInsecure(),
      (err, port) => {
        if (err) {
          console.error("❌ User Service: Failed to bind server:", err);
          process.exit(1);
        }

        server.start();
        console.log(`🚀 User Service: gRPC server running on port ${port}`);
        console.log("✅ User Service: Ready to handle requests");
      }
    );
  } catch (error) {
    console.error("❌ User Service: Failed to start server:", error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 User Service: Shutting down gracefully...");
  await sequelize.close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 User Service: Shutting down gracefully...");
  await sequelize.close();
  process.exit(0);
});

// Start the server
startServer();
