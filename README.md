# Ecommerce gRPC Microservices

A production-ready, microservice-based eCommerce application built with Node.js, gRPC, PostgreSQL, and Docker.

## Architecture

The application consists of 3 microservices:

- **User Service** (Port 50051): Handles user registration, login, and user management
- **Product Service** (Port 50052): Manages product CRUD operations and stock management
- **Order Service** (Port 50053): Handles order creation and management with inter-service communication

## Technology Stack

- **Runtime**: Node.js 18
- **Communication**: gRPC
- **Database**: PostgreSQL with Sequelize ORM
- **Containerization**: Docker + Docker Compose
- **Authentication**: JWT (optional)
- **Password Hashing**: bcryptjs

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)

## Quick Start

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Ecommerce-gRPC
   ```

2. **Start all services**

   ```bash
   docker compose up -d
   ```

3. **Check service status**

   ```bash
   docker compose ps
   ```

4. **View logs**

   ```bash
   # All services
   docker compose logs -f

   # Specific service
   docker compose logs -f user-service
   ```

## Service Endpoints

### User Service (Port 50051)

- `Register(email, password)` - Register a new user
- `Login(email, password)` - Authenticate user and get JWT token
- `GetUser(id)` - Get user information by ID

### Product Service (Port 50052)

- `CreateProduct(name, price, stock)` - Create a new product
- `GetProduct(id)` - Get product by ID
- `ListProducts(page, limit)` - List products with pagination
- `UpdateProduct(id, name, price, stock)` - Update product information
- `DeleteProduct(id)` - Delete a product
- `CheckStock(product_id, quantity)` - Check product stock availability

### Order Service (Port 50053)

- `CreateOrder(user_id, product_id, quantity)` - Create a new order
- `GetOrder(id)` - Get order by ID
- `ListOrders(user_id, page, limit)` - List orders with pagination
- `UpdateOrderStatus(id, status)` - Update order status

## Database Schema

### User Service Database (`user_db`)

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Product Service Database (`product_db`)

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Order Service Database (`order_db`)

```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Development

### Local Development Setup

1. **Install dependencies for each service**

   ```bash
   cd user-service && npm install
   cd ../product-service && npm install
   cd ../order-service && npm install
   ```

2. **Set up databases**

   ```bash
   # Start only the databases
   docker compose up -d postgres-user postgres-product postgres-order
   ```

3. **Run services locally**

   ```bash
   # Terminal 1 - User Service
   cd user-service && npm run dev

   # Terminal 2 - Product Service
   cd product-service && npm run dev

   # Terminal 3 - Order Service
   cd order-service && npm run dev
   ```

### Environment Variables

Each service supports the following environment variables:

#### User Service

- `DB_HOST` - Database host (default: postgres-user)
- `DB_PORT` - Database port (default: 5432)
- `DB_NAME` - Database name (default: user_db)
- `DB_USER` - Database user (default: postgres)
- `DB_PASSWORD` - Database password (default: password)
- `PORT` - Service port (default: 50051)
- `JWT_SECRET` - JWT secret key

#### Product Service

- `DB_HOST` - Database host (default: postgres-product)
- `DB_PORT` - Database port (default: 5432)
- `DB_NAME` - Database name (default: product_db)
- `DB_USER` - Database user (default: postgres)
- `DB_PASSWORD` - Database password (default: password)
- `PORT` - Service port (default: 50052)

#### Order Service

- `DB_HOST` - Database host (default: postgres-order)
- `DB_PORT` - Database port (default: 5432)
- `DB_NAME` - Database name (default: order_db)
- `DB_USER` - Database user (default: postgres)
- `DB_PASSWORD` - Database password (default: password)
- `PORT` - Service port (default: 50053)
- `USER_SERVICE_HOST` - User service host (default: user-service)
- `USER_SERVICE_PORT` - User service port (default: 50051)
- `PRODUCT_SERVICE_HOST` - Product service host (default: product-service)
- `PRODUCT_SERVICE_PORT` - Product service port (default: 50052)

## Testing the Services

### Using gRPC Client Tools

1. **Install grpcurl** (for testing gRPC endpoints)

   ```bash
   # macOS
   brew install grpcurl

   # Linux
   sudo apt-get install grpcurl
   ```

2. **Test User Service**

   ```bash
   # Register a user
   grpcurl -plaintext -d '{"email": "test@example.com", "password": "password123"}' localhost:50051 user.UserService/Register

   # Login
   grpcurl -plaintext -d '{"email": "test@example.com", "password": "password123"}' localhost:50051 user.UserService/Login
   ```

3. **Test Product Service**

   ```bash
   # Create a product
   grpcurl -plaintext -d '{"name": "Test Product", "price": 29.99, "stock": 100}' localhost:50052 product.ProductService/CreateProduct

   # List products
   grpcurl -plaintext -d '{"page": 1, "limit": 10}' localhost:50052 product.ProductService/ListProducts
   ```

4. **Test Order Service**
   ```bash
   # Create an order (replace user_id and product_id with actual IDs)
   grpcurl -plaintext -d '{"user_id": 1, "product_id": 1, "quantity": 2}' localhost:50053 order.OrderService/CreateOrder
   ```

## Production Deployment

### Security Considerations

1. **Change default passwords** in docker compose.yml
2. **Use strong JWT secrets**
3. **Enable TLS/SSL** for gRPC communication
4. **Set up proper firewall rules**
5. **Use environment-specific configurations**

### Scaling

Each service can be scaled independently:

```bash
# Scale user service to 3 instances
docker compose up -d --scale user-service=3

# Scale product service to 2 instances
docker compose up -d --scale product-service=2
```

### Monitoring

- Services include health checks
- Logs are available via `docker compose logs`
- Consider adding Prometheus metrics and Grafana dashboards

## Troubleshooting

### Common Issues

1. **Database connection errors**

   - Ensure databases are running: `docker compose ps`
   - Check database logs: `docker compose logs postgres-user`

2. **Service communication errors**

   - Verify all services are healthy: `docker compose ps`
   - Check service logs: `docker compose logs order-service`

3. **Port conflicts**
   - Change ports in docker compose.yml if needed
   - Ensure no other services are using the same ports

### Useful Commands

```bash
# Stop all services
docker compose down

# Stop and remove volumes (WARNING: This will delete all data)
docker compose down -v

# Rebuild services
docker compose build --no-cache

# View service logs
docker compose logs -f [service-name]

# Access database directly
docker exec -it postgres-user psql -U postgres -d user_db
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
