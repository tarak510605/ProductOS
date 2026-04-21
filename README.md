# ProductOS - Scalable REST API + React UI

Product name: ProductOS

Complete full-stack project with:
- Node.js + Express backend
- MongoDB + Mongoose
- Redis caching
- JWT authentication
- Role-based access (user/admin)
- Products CRUD
- React frontend with protected dashboard
- Swagger API documentation
- Rate limiting and security middleware
- Docker compose setup

## Project Structure

backend/
- src/config
- src/controllers
- src/middleware
- src/models
- src/routes/v1
- src/services
- src/utils
- src/validators
- server.js

frontend/
- src/api
- src/components
- src/context
- src/pages

## Backend Setup

1. Go to backend:
   npm install
2. Create env file:
   cp .env.example .env
3. Set required env values in .env:
   PORT, MONGO_URI, JWT_SECRET, JWT_EXPIRES_IN, CLIENT_ORIGIN
4. Optional: start Redis locally if you want caching in development.
5. Start backend in dev mode:
   npm run dev

Backend runs on:
- http://localhost:5001

Health endpoint:
- GET /health

Swagger docs:
- http://localhost:5001/api-docs

## Frontend Setup

1. Go to frontend:
   npm install
2. Create env file:
   cp .env.example .env
3. Set required env values in .env:
   VITE_API_BASE_URL
4. Start frontend:
   npm run dev

Frontend runs on:
- http://localhost:5173

## API Summary

### Auth
- POST /api/v1/auth/register
- POST /api/v1/auth/login
- GET /api/v1/auth/profile (protected)

### Products (protected)
- POST /api/v1/products
- GET /api/v1/products
- GET /api/v1/products/:id
- PUT /api/v1/products/:id
- DELETE /api/v1/products/:id

### Admin (admin only)
- GET /api/v1/admin/users
- DELETE /api/v1/admin/users

## Notes on Access Control

- All products endpoints require JWT.
- user role can access only own products.
- admin role can access all products and admin endpoints.
- First registered account is automatically assigned admin.

## Security Included

- Password hashing with bcryptjs
- JWT validation middleware
- JWT includes user id and role claims
- Helmet for headers
- CORS support
- express-validator + request sanitization (NoSQL injection and HTML/XSS sanitization)
- Request rate limiting
- Centralized error handling

## Scalability Notes

- Caching: Redis is integrated for response caching to reduce repeated database reads.
- Horizontal scaling: The API is stateless with JWT auth, so multiple backend instances can run behind a load balancer.
- Microservices-ready path: Auth, product, and admin modules are isolated and can be split into independent services as traffic grows.

## Test

From backend:
- npm test

## Docker

1. Create backend env file first:
   cp backend/.env.example backend/.env
   and update JWT secret.
2. Start all services:
   docker compose up --build

Services:
- frontend: http://localhost:5173
- backend: http://localhost:5001
- mongo: localhost:27017
- redis: localhost:6379

## Default Data Flow

1. Register user from frontend
2. Login
3. Create and manage products from dashboard
4. Use Swagger for API inspection/testing
