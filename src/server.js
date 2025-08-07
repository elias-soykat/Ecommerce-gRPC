const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const config = require("./config");
const { sequelize } = require("./models");
const userService = require("./services/user");
const productService = require("./services/product");
const orderService = require("./services/order");
const loggingInterceptor = require("./interceptors/logging");
// const jwtAuth = require('./middleware/auth'); // Attach per-method if needed

const PROTO_PATHS = {
  user: __dirname + "/../proto/user.proto",
  product: __dirname + "/../proto/product.proto",
  order: __dirname + "/../proto/order.proto",
};

function loadProto(path, packageName) {
  const packageDefinition = protoLoader.loadSync(path, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
  return grpc.loadPackageDefinition(packageDefinition)[packageName];
}

async function main() {
  await sequelize.sync();

  const server = new grpc.Server();

  // UserService
  const userProto = loadProto(PROTO_PATHS.user, "user");
  server.addService(userProto.UserService.service, userService);

  // ProductService
  const productProto = loadProto(PROTO_PATHS.product, "product");
  server.addService(productProto.ProductService.service, productService);

  // OrderService
  const orderProto = loadProto(PROTO_PATHS.order, "order");
  server.addService(orderProto.OrderService.service, orderService);

  server.bindAsync(
    `0.0.0.0:${config.port}`,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error("Server error:", err);
        process.exit(1);
      }
      console.log(`gRPC server running on port ${port}`);
    }
  );
}

main();
