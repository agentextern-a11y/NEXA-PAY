import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import compress from '@fastify/compress';
import swagger from '@fastify/swagger';

// Initialize Fastify instance
const server: FastifyInstance = Fastify({
  logger: true
});

// Register plugins
server.register(cors);
server.register(compress);
server.register(swagger, {
  routePrefix: '/docs',
  swagger: {
    info: {
      title: 'API Gateway',
      description: 'Unified entrypoint for all clients.',
      version: '1.0.0'
    }
  },
  exposeRoute: true
});

// Declare a health check route
server.get('/health', async (request, reply) => {
  return { status: 'ok' };
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen({ port: Number(PORT), host: '0.0.0.0' }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  server.log.info(`API Gateway running at: ${address}`);
});