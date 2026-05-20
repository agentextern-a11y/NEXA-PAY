# Ledger Service

The `ledger-service` is the core system for managing financial transactions. It provides support for:

- Append-only ledger entries.
- Debit and credit balance calculations.
- Settlement and reconciliation handling (future scope).

### Endpoints

- **Create Ledger Entry**: `POST /ledger/entry`
- **Get Account Balance**: `GET /ledger/balance/:accountId`

### Database Tables

- `accounts`: Stores account metadata.
- `ledger_entries`: Tracks all financial transactions in an append-only model.
- `reconciliations`: Tracks reconciliation job statuses.
- `settlements`: Manages settlement data.

### Development

- Start the server in development mode:
  ```bash
  pnpm dev
  ```
- Build the service:
  ```bash
  pnpm build
  ```
- Run the built server:
  ```bash
  pnpm start
  ```