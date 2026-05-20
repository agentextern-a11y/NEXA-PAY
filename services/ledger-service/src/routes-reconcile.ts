import { startReconciliation, getReconciliationStatus } from './reconciliation';

server.post('/ledger/reconcile', async (request, reply) => {
  try {
    const { reconciliationId, jobId } = await startReconciliation();
    reply.code(201).send({ message: 'Reconciliation started', reconciliationId, jobId });
  } catch (err) {
    server.log.error(err);
    reply.code(500).send({ message: 'Error starting reconciliation' });
  }
});

server.get('/ledger/reconcile/:jobId', async (request, reply) => {
  try {
    const { jobId } = request.params as any;
    const status = await getReconciliationStatus(jobId);
    if (!status) {
      reply.code(404).send({ message: 'Reconciliation job not found' });
      return;
    }
    reply.code(200).send({ jobId, status });
  } catch (err) {
    server.log.error(err);
    reply.code(500).send({ message: 'Error retrieving reconciliation status' });
  }
});