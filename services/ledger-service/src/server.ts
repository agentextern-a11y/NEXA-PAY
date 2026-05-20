import Fastify, { FastifyInstance } from 'fastify';
import { Pool } from 'pg';

const server: FastifyInstance = Fastify({
  logger: true
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://nexa_user:nexa_pass@localhost:5432/nexa_ledger'
});

server.post('/ledger/entry', async (request, reply) => {
  const client = await pool.connect();
  try {
    const { account_id, amount, type } = request.body as any;

    // Append-only logic for ledger entries
    if (!['debit', 'credit'].includes(type)) {
      return reply.code(400).send({ message: 'Invalid entry type' });
    }

    const res = await client.query(
      `INSERT INTO ledger_entries (account_id, amount, type) VALUES ($1, $2, $3) RETURNING id`,
      [account_id, amount, type]
    );
    reply.code(201).send({ entry_id: res.rows[0].id });
  } catch (err) {
    server.log.error(err);
    reply.code(500).send({ message: 'Error creating ledger entry' });
  } finally {
    client.release();
  }
});

server.get('/ledger/balance/:accountId', async (request, reply) => {
  const client = await pool.connect();
  try {
    const { accountId } = request.params as any;
    const res = await client.query(
      `SELECT 
        COALESCE(SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END) - 
        SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END), 0) AS balance
      FROM ledger_entries WHERE account_id = $1`,
      [accountId]
    );
    reply.code(200).send({ balance: res.rows[0].balance });
  } catch (err) {
    server.log.error(err);
    reply.code(500).send({ message: 'Error retrieving balance' });
  } finally {
    client.release();
  }
});

server.listen({ port: 5000, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  server.log.info(`Ledger Service running at ${address}`);
});