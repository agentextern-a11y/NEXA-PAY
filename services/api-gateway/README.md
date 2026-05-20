# API Gateway

The `api-gateway` service acts as the unified entry point for all clients. It handles request routing, authentication, rate-limiting, and more.

### Features
- **Health Check**: `GET /health`
- **Swagger Documentation**: `GET /docs`
- **CORS and Compression**: Enabled through Fastify plugins.

### Development
- Start the server in development:
  ```bash
  pnpm dev
  ```
- Build the service:
  ```bash
  pnpm build
  ```
- Run the product build:
  ```bash
  pnpm start
  ```