import emailRoutes from './emails.js';
import aiRoutes from './ai.js';

export default async function routes(fastify, options) {
  // Register email routes
  fastify.register(emailRoutes, { prefix: '/emails' });
  
  // Register AI routes under emails/ai
  fastify.register(aiRoutes, { prefix: '/emails/ai' });
  
  // Health check route
  fastify.get('/ping', async (request, reply) => {
    return 'pong\n';
  });
}
