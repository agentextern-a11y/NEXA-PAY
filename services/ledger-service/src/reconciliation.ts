import { Pool } from 'pg';
import { randomUUID } from 'crypto';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://nexa_user:nexa_pass@localhost:5432/nexa_ledger'
});

export const startReconciliation = async () => {
  const client = await pool.connect();
  const jobId = randomUUID();
  try {
    const result = await client.query(
      `INSERT INTO reconciliations (job_id, status) VALUES ($1, $2) RETURNING id`,
      [jobId, 'IN_PROGRESS']
    );
    return { reconciliationId: result.rows[0].id, jobId };
  } finally {
    client.release();
  }
};

export const getReconciliationStatus = async (jobId: string) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT status, created_at FROM reconciliations WHERE job_id = $1`,
      [jobId]
    );
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  } finally {
    client.release();
  }
};