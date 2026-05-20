import { Pool } from 'pg';
import argon2 from 'argon2';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://nexa_user:nexa_pass@localhost:5432/nexa_auth'
});

export const registerUser = async (username: string, password: string, email: string) => {
  const client = await pool.connect();
  try {
    const passwordHash = await argon2.hash(password);
    const result = await client.query(
      `INSERT INTO users (username, password_hash, email) VALUES ($1, $2, $3) RETURNING id`,
      [username, passwordHash, email]
    );
    return result.rows[0].id;
  } finally {
    client.release();
  }
};

export const createSession = async (userId: number, token: string, expiresAt: Date) => {
  const client = await pool.connect();
  try {
    await client.query(
      `INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, $3)`,
      [userId, token, expiresAt]
    );
  } finally {
    client.release();
  }
};

export default pool;