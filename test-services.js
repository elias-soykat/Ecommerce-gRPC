#!/usr/bin/env node

/**
 * Test script for Ecommerce gRPC Microservices
 * This script tests all three services to ensure they're working correctly
 */

const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

// Load proto files
const userProtoPath = path.join(
  __dirname,
  "user-service",
  "src",
  "proto",
  "user.proto"
);
const productProtoPath = path.join(
  __dirname,
  "product-service",
  "src",
  "proto",
  "product.proto"
);
const orderProtoPath = path.join(
  __dirname,
  "order-service",
  "src",
  "proto",
  "order.proto"
);

const userPackageDefinition = protoLoader.loadSync(userProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const productPackageDefinition = protoLoader.loadSync(productProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const orderPackageDefinition = protoLoader.loadSync(orderProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const userProto = grpc.loadPackageDefinition(userPackageDefinition).user;
const productProto = grpc.loadPackageDefinition(
  productPackageDefinition
).product;
const orderProto = grpc.loadPackageDefinition(orderPackageDefinition).order;

// Create clients
const userClient = new userProto.UserService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);
const productClient = new productProto.ProductService(
  "localhost:50052",
  grpc.credentials.createInsecure()
);
const orderClient = new orderProto.OrderService(
  "localhost:50053",
  grpc.credentials.createInsecure()
);

const email = `test${Date.now()}@example.com`;
const password = `password${Date.now()}`;

// Test functions
function testUserService() {
  return new Promise((resolve, reject) => {
    console.log("🧪 Testing User Service...");

    // Test user registration
    userClient.register(
      {
        email: email,
        password: password,
      },
      (error, response) => {
        if (error) {
          console.error("❌ User registration failed:", error.message);
          reject(error);
          return;
        }

        console.log("✅ User registered successfully:", response.email);
        const userId = response.id;

        // Test user login
        userClient.login(
          {
            email: email,
            password: password,
          },
          (error, response) => {
            if (error) {
              console.error("❌ User login failed:", error.message);
              reject(error);
              return;
            }

            console.log("✅ User login successful, token received");
            resolve({ userId, token: response.token });
          }
        );
      }
    );
  });
}

function testProductService() {
  return new Promise((resolve, reject) => {
    console.log("🧪 Testing Product Service...");

    // Test product creation
    productClient.createProduct(
      {
        name: "Test Product",
        price: 29.99,
        stock: 100,
      },
      (error, response) => {
        if (error) {
          console.error("❌ Product creation failed:", error.message);
          reject(error);
          return;
        }

        console.log("✅ Product created successfully:", response.name);
        const productId = response.id;

        // Test product retrieval
        productClient.getProduct({ id: productId }, (error, response) => {
          if (error) {
            console.error("❌ Product retrieval failed:", error.message);
            reject(error);
            return;
          }

          console.log("✅ Product retrieved successfully:", response.name);
          resolve({ productId });
        });
      }
    );
  });
}

function testOrderService(userId, productId) {
  return new Promise((resolve, reject) => {
    console.log("🧪 Testing Order Service...");

    // Test order creation
    orderClient.createOrder(
      {
        user_id: userId,
        product_id: productId,
        quantity: 2,
      },
      (error, response) => {
        if (error) {
          console.error("❌ Order creation failed:", error.message);
          reject(error);
          return;
        }

        console.log("✅ Order created successfully:", `Order #${response.id}`);
        console.log("   - User:", response.user.email);
        console.log("   - Product:", response.product.name);
        console.log("   - Quantity:", response.quantity);
        console.log("   - Total Price:", response.total_price);
        console.log("   - Status:", response.status);

        resolve(response.id);
      }
    );
  });
}

// Main test function
async function runTests() {
  try {
    console.log("🚀 Starting Ecommerce gRPC Microservices Test\n");

    // Test User Service
    const { userId } = await testUserService();
    console.log("");

    // Test Product Service
    const { productId } = await testProductService();
    console.log("");

    // Test Order Service
    await testOrderService(userId, productId);
    console.log("");

    console.log("🎉 All tests passed! Services are working correctly.");
    console.log("\n📊 Test Summary:");
    console.log("   ✅ User Service: Registration and Login");
    console.log("   ✅ Product Service: Creation and Retrieval");
    console.log(
      "   ✅ Order Service: Creation with inter-service communication"
    );
  } catch (error) {
    console.error("\n❌ Test failed:", error.message);
    console.log("\n💡 Troubleshooting tips:");
    console.log("   1. Ensure all services are running: docker compose ps");
    console.log("   2. Check service logs: docker compose logs");
    console.log(
      "   3. Verify ports are not in use: netstat -tulpn | grep :5005"
    );
    process.exit(1);
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests();
}

module.exports = { runTests };
