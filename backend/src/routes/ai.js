import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function aiRoutes(fastify) {
  // Not the best or most efficient way to route to the correct assistant, maybe lets the user to choose the assistant?
  fastify.post('/route', async (request, reply) => {
    try {
      const { prompt, recipientBusiness } = request.body;
      
      if (!prompt) {
        return reply.code(400).send({
          error: 'Prompt is required'
        });
      }

      const routingPrompt = `You are an email routing assistant. Analyze the user's request and classify it into one of these categories:
1. "sales" - for sales emails, business proposals, product introductions
2. "followup" - for follow-up emails, checking in, reminders

Respond with ONLY the category name: "sales" or "followup"

User request: "${prompt}"`;

      const routingResponse = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: routingPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: 10,
        temperature: 0.1
      });

      const category = routingResponse.choices[0].message.content.trim().toLowerCase();
      
      return reply.send({
        category,
        message: `Routed to ${category} assistant`
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        error: 'Failed to route email request'
      });
    }
  });

  // Sales Assistant - Generates sales emails
  fastify.post('/sales', async (request, reply) => {
    try {
      const { prompt, recipientBusiness, recipientName } = request.body;
      
      if (!prompt) {
        return reply.code(400).send({
          error: 'Prompt is required'
        });
      }

      const salesPrompt = `You are a Sales Assistant. Generate a professional sales email based on the user's request.

Requirements:
- Keep the email under 40 words total (readable in under 10 seconds)
- Use 7-10 words per sentence maximum
- Make it engaging and professional
- Include both subject line and email body
- Tailor to the recipient's business context

User request: "${prompt}"
Recipient business: ${recipientBusiness || 'General business'}
Recipient name: ${recipientName || 'there'}

Generate the email in this exact JSON format:
{
  "subject": "Subject line here",
  "body": "Email body here"
}`;

      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: salesPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: 200,
        temperature: 0.7
      });

      const content = response.choices[0].message.content;
      let emailData;
      
      try {
        emailData = JSON.parse(content);
      } catch (parseError) {
        // Fallback if JSON parsing fails
        emailData = {
          subject: 'Sales Proposal',
          body: content
        };
      }

      return reply.send({
        success: true,
        email: emailData
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        error: 'Failed to generate sales email'
      });
    }
  });

  // Follow-up Assistant - Generates follow-up emails
  fastify.post('/followup', async (request, reply) => {
    try {
      const { prompt, recipientName, previousContext } = request.body;
      
      if (!prompt) {
        return reply.code(400).send({
          error: 'Prompt is required'
        });
      }

      const followupPrompt = `You are a Follow-up Assistant. Generate a polite and professional follow-up email based on the user's request.

Requirements:
- Keep the email under 40 words total (readable in under 10 seconds)
- Use 7-10 words per sentence maximum
- Make it polite and non-pushy
- Include both subject line and email body
- Reference previous context if provided

User request: "${prompt}"
Recipient name: ${recipientName || 'there'}
Previous context: ${previousContext || 'General follow-up'}

Generate the email in this exact JSON format:
{
  "subject": "Subject line here",
  "body": "Email body here"
}`;

      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: followupPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: 200,
        temperature: 0.7
      });

      const content = response.choices[0].message.content;
      let emailData;
      
      try {
        emailData = JSON.parse(content);
      } catch (parseError) {
        // Fallback if JSON parsing fails
        emailData = {
          subject: 'Following Up',
          body: content
        };
      }

      return reply.send({
        success: true,
        email: emailData
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        error: 'Failed to generate follow-up email'
      });
    }
  });
} 