# ecommerce-grpc-app

A production-ready backend using Node.js, gRPC, PostgreSQL, and Sequelize.

## Features

- Node.js (plain JavaScript)
- gRPC APIs (User, Product, Order)
- PostgreSQL with Sequelize ORM
- JWT authentication (sign/verify)
- Logging interceptor
- Dockerized and ready for production

---

## How to Run the Project

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/ecommerce-grpc-app.git
cd ecommerce-grpc-app
```

### 2. Create and Configure Environment Variables

Copy `.env.example` to `.env` and edit the values as needed.

```bash
cp .env.example .env
# Edit .env with your preferred values
```

### 3. Build and Start with Docker (Recommended)

This will run both the backend and PostgreSQL in containers:

```bash
docker-compose up --build
```

- The backend server will wait for the database to be ready.
- The gRPC server will run on the port you set in `.env` (default: 50051).

### 4. Run Locally (Without Docker)

**Prerequisites:**  
- Node.js (v18+ recommended)  
- PostgreSQL running locally

**Install dependencies:**

```bash
npm install
```

**Set up your database:**  
Make sure PostgreSQL is running and the credentials in `.env` match your local setup.

**Run the server:**

```bash
npm run proto:generate  # Optional, not required with proto-loader
npm start
```

---

## gRPC Testing Example

You can use [grpcurl](https://github.com/fullstorydev/grpcurl) to test your gRPC endpoints.  
Example for User Registration:

```bash
grpcurl -plaintext -d '{ "email": "test@example.com", "password": "secret" }' localhost:50051 user.UserService/Register
```

---

See the main README sections for more usage and API documentation!