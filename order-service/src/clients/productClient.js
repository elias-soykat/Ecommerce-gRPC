const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

// Load product service proto
const PRODUCT_PROTO_PATH = path.join(__dirname, "..", "proto", "product.proto");

const productPackageDefinition = protoLoader.loadSync(PRODUCT_PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const productProto = grpc.loadPackageDefinition(
  productPackageDefinition
).product;

class ProductClient {
  constructor() {
    const productServiceHost =
      process.env.PRODUCT_SERVICE_HOST || "product-service";
    const productServicePort = process.env.PRODUCT_SERVICE_PORT || 50052;

    this.client = new productProto.ProductService(
      `${productServiceHost}:${productServicePort}`,
      grpc.credentials.createInsecure()
    );
  }

  /**
   * Get product by ID
   * @param {number} productId - Product ID
   * @returns {Promise<Object>} Product data
   */
  async getProductById(productId) {
    return new Promise((resolve, reject) => {
      this.client.getProduct({ id: productId }, (error, response) => {
        if (error) {
          console.error("Product service error:", error.message);
          reject(new Error(`Failed to get product: ${error.message}`));
        } else {
          resolve(response);
        }
      });
    });
  }

  /**
   * Check product stock availability
   * @param {number} productId - Product ID
   * @param {number} quantity - Required quantity
   * @returns {Promise<Object>} Stock check result
   */
  async checkStock(productId, quantity) {
    return new Promise((resolve, reject) => {
      this.client.checkStock(
        {
          product_id: productId,
          quantity: quantity,
        },
        (error, response) => {
          if (error) {
            console.error("Product service error:", error.message);
            reject(new Error(`Failed to check stock: ${error.message}`));
          } else {
            resolve(response);
          }
        }
      );
    });
  }
}

module.exports = new ProductClient();
