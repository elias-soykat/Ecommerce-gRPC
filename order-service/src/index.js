const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const { testConnection, sequelize } = require("./db");
const Order = require("./models/Order");
const orderController = require("./controllers/orderController");

// Load proto file
const PROTO_PATH = path.join(__dirname, "proto", "order.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const orderProto = grpc.loadPackageDefinition(packageDefinition).order;

// Initialize database and start server
async function startServer() {
  try {
    // Test database connection
    await testConnection();

    // Sync database (create tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log("✅ Order Service: Database synchronized successfully.");

    // Create gRPC server
    const server = new grpc.Server();

    // Add service to server
    server.addService(orderProto.OrderService.service, {
      createOrder: orderController.createOrder,
      getOrder: orderController.getOrder,
      listOrders: orderController.listOrders,
      updateOrderStatus: orderController.updateOrderStatus,
    });

    // Start server
    const port = process.env.PORT || 50053;
    server.bindAsync(
      `0.0.0.0:${port}`,
      grpc.ServerCredentials.createInsecure(),
      (err, port) => {
        if (err) {
          console.error("❌ Order Service: Failed to bind server:", err);
          process.exit(1);
        }

        server.start();
        console.log(`🚀 Order Service: gRPC server running on port ${port}`);
        console.log("✅ Order Service: Ready to handle requests");
      }
    );
  } catch (error) {
    console.error("❌ Order Service: Failed to start server:", error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Order Service: Shutting down gracefully...");
  await sequelize.close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Order Service: Shutting down gracefully...");
  await sequelize.close();
  process.exit(0);
});

// Start the server
startServer();
