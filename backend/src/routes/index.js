import emailRoutes from './emails.js';

export default async function routes(fastify, options) {
  // Register email routes
  fastify.register(emailRoutes, { prefix: '/emails' });
  
  // Health check route
  fastify.get('/ping', async (request, reply) => {
    return 'pong\n';
  });
}
