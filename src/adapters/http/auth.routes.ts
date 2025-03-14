import { FastifyInstance } from 'fastify';
import { AuthController } from 'ports/in/auth/auth.controller';

const authController = new AuthController();
export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/login', async (request, reply) => {
    return authController.handle(request, reply);
  });
}
