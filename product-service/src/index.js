const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const { testConnection, sequelize } = require("./db");
const Product = require("./models/Product");
const productController = require("./controllers/productController");

// Load proto file
const PROTO_PATH = path.join(__dirname, "proto", "product.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const productProto = grpc.loadPackageDefinition(packageDefinition).product;

// Initialize database and start server
async function startServer() {
  try {
    // Test database connection
    await testConnection();

    // Sync database (create tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log("✅ Product Service: Database synchronized successfully.");

    // Create gRPC server
    const server = new grpc.Server();

    // Add service to server
    server.addService(productProto.ProductService.service, {
      createProduct: productController.createProduct,
      getProduct: productController.getProduct,
      listProducts: productController.listProducts,
      updateProduct: productController.updateProduct,
      deleteProduct: productController.deleteProduct,
      checkStock: productController.checkStock,
    });

    // Start server
    const port = process.env.PORT || 50052;
    server.bindAsync(
      `0.0.0.0:${port}`,
      grpc.ServerCredentials.createInsecure(),
      (err, port) => {
        if (err) {
          console.error("❌ Product Service: Failed to bind server:", err);
          process.exit(1);
        }

        server.start();
        console.log(`🚀 Product Service: gRPC server running on port ${port}`);
        console.log("✅ Product Service: Ready to handle requests");
      }
    );
  } catch (error) {
    console.error("❌ Product Service: Failed to start server:", error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Product Service: Shutting down gracefully...");
  await sequelize.close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Product Service: Shutting down gracefully...");
  await sequelize.close();
  process.exit(0);
});

// Start the server
startServer();
