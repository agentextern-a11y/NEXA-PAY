# Auth Service

The `auth-service` provides functionality for user authentication, session handling, and account management. It is the foundation for secure user access to the Nexa Pay ecosystem.

### Features
- **Health Check**: `GET /health`
- **User Registration**: `POST /auth/register`
- **User Login**: `POST /auth/login` (stub for issuing JWTs)

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