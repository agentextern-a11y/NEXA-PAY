import { test } from 'tap';
import Fastify from 'fastify';
import { startReconciliation, getReconciliationStatus } from '../reconciliation';
import pg from 'pg';

const server = Fastify({ logger: false });

// Mock the database pool
jest.mock('pg', () => {
  const mClient = {
    query: jest.fn(),
    release: jest.fn()
  };
  const mPool = {
    connect: jest.fn(() => mClient)
  };
  return { Pool: jest.fn(() => mPool) };
});

const mockPool = new pg.Pool();
const mockClient = await mockPool.connect();

// Unit test for startReconciliation
test('startReconciliation successfully creates a job', async (t) => {
  mockClient.query.mockReturnValueOnce({
    rows: [{ id: 1 }],
  });
  const result = await startReconciliation();
  t.match(result, { reconciliationId: 1 });
});

// Unit test for getReconciliationStatus
test('getReconciliationStatus retrieves job details', async (t) => {
  mockClient.query.mockReturnValueOnce({
    rows: [{ status: 'IN_PROGRESS', created_at: new Date() }],
  });
  const result = await getReconciliationStatus('job-id');
  t.match(result, { status: 'IN_PROGRESS' });
});