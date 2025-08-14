import DB from '../db/index.js';

export default async function emailRoutes(fastify) {
  fastify.post('/', async (request, reply) => {
    try {
      const { to, cc, bcc, subject, body } = request.body;
      
      if (!to || !subject || !body) {
        return reply.code(400).send({
          error: 'Missing required fields: to, subject, and body are required'
        });
      }

      const emailData = {
        to,
        cc: cc || null,
        bcc: bcc || null,
        subject,
        body
      };

      const result = await DB.createEmail(emailData);
      
      return reply.code(201).send({
        message: 'Email created successfully',
        id: result[0]
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        error: 'Internal server error'
      });
    }
  });

  fastify.get('/', async (request, reply) => {
    try {
      const emails = await DB.getEmails();
      
      return reply.send({
        emails,
        count: emails.length
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        error: 'Internal server error'
      });
    }
  });

  fastify.get('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      
      if (!id || isNaN(parseInt(id))) {
        return reply.code(400).send({
          error: 'Valid email ID is required'
        });
      }

      const email = await DB.getEmailById(parseInt(id));
      
      if (!email) {
        return reply.code(404).send({
          error: 'Email not found'
        });
      }

      return reply.send(email);
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        error: 'Internal server error'
      });
    }
  });

  fastify.get('/user/:userFK', async (request, reply) => {
    try {
      const { userFK } = request.params;
      const emails = await DB.getEmailsByUser(userFK);
      
      return reply.send({
        emails,
        count: emails.length,
        userFK
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        error: 'Internal server error'
      });
    }
  });
} 