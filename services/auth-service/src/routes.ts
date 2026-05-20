import { registerUser, createSession } from './db';
import jwt from '@fastify/jwt';

server.post('/auth/register', async (request, reply) => {
  const { username, password, email } = request.body as any;
  try {
    const userId = await registerUser(username, password, email);
    reply.code(201).send({ message: 'User registered successfully', userId });
  } catch (error) {
    server.log.error(error);
    reply.code(500).send({ message: 'Registration failed' });
  }
});

server.post('/auth/login', async (request, reply) => {
  const { username, password } = request.body as any;
  try {
    const token = server.jwt.sign({ username });
    await createSession(1 /* Example userId */, token, new Date(Date.now() + 3600 * 1000)); // Expires in 1 hour
    reply.code(200).send({ token });
  } catch (error) {
    server.log.error(error);
    reply.code(500).send({ message: 'Login failed' });
  }
});