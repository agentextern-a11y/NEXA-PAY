import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import compress from '@fastify/compress';
import jwt from '@fastify/jwt';
import { z } from 'zod';

const server: FastifyInstance = Fastify({
  logger: true
});

// Register plugins
server.register(cors);
server.register(compress);
server.register(jwt, {
  secret: process.env.JWT_SECRET || 'supersecretkey',
});

// Health check
server.get('/health', async (request, reply) => {
  return { status: 'ok' };
});

// User Registration (Stub)
server.post('/auth/register', async (request, reply) => {
  const body = z.object({
    username: z.string(),
    password: z.string().min(8)
  });

  const { username, password } = body.parse(request.body);

  // Handle user registration logic
  reply.code(201).send({ message: `User ${username} registered successfully.` });
});

// User Login (Stub)
server.post('/auth/login', async (request, reply) => {
  const body = z.object({
    username: z.string(),
    password: z.string()
  });

  const { username, password } = body.parse(request.body);

  // Sample JWT issuance
  const token = server.jwt.sign({ username });
  reply.code(200).send({ token });
});

// Start the server
const PORT = process.env.PORT || 4000;
server.listen({ port: Number(PORT), host: '0.0.0.0' }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  server.log.info(`Auth Service running at: ${address}`);
});