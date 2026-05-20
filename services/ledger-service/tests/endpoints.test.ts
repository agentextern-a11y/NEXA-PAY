import { test } from 'tap';
import Fastify from 'fastify';
import server from '../server';

// End-to-end test for starting a reconciliation
test('POST /ledger/reconcile', async (t) => {
  const response = await server.inject({
    method: 'POST',
    url: '/ledger/reconcile'
  });

  t.equal(response.statusCode, 201, 'returns a 201 Created');
  t.ok(response.json().jobId, 'returns a jobId in response');
});

// End-to-end test for retrieving reconciliation status
test('GET /ledger/reconcile/:jobId', async (t) => {
  const jobId = 'test-job-id';

  // Mock response for job ID
  server.pg.query.mockReturnValueOnce({
    rows: [{ status: 'IN_PROGRESS', created_at: new Date() }],
  });

  const response = await server.inject({
    method: 'GET',
    url: `/ledger/reconcile/${jobId}`
  });

  t.equal(response.statusCode, 200, 'returns a 200 OK');
  t.match(response.json(), { status: 'IN_PROGRESS' }, 'retrieves the correct status');
});