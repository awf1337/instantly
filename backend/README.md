# Email Management Backend API

A Fastify-based backend API for email management with AI-powered email generation capabilities.

## Features

- **Email Management**: Create, retrieve, and list emails
- **AI-Powered Email Generation**: Sales and follow-up email assistants
- **Smart Routing**: AI router that automatically determines the best assistant for your needs
- **Database Storage**: SQLite database with Knex.js ORM

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Update .env with your OpenAI API key
   OPENAI_API_KEY=your_actual_api_key_here
   ```

3. **Database Setup**:
   ```bash
   npm run migrate
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

## API Endpoints

### Health Check
- **GET** `/ping` - Server health check

### Email Management
- **POST** `/emails` - Create a new email
- **GET** `/emails` - List all emails
- **GET** `/emails/:id` - Get single email by ID
- **GET** `/emails/user/:userFK` - Get emails by specific user

### AI-Powered Email Generation

#### Router Assistant
- **POST** `/emails/ai/route` - AI router that determines the best assistant
  ```json
  {
    "prompt": "Meeting request for Tuesday",
    "recipientBusiness": "Tech startup"
  }
  ```

#### Sales Assistant
- **POST** `/emails/ai/sales` - Generate sales emails
  ```json
  {
    "prompt": "Introduce our new SaaS product",
    "recipientBusiness": "E-commerce company",
    "recipientName": "John"
  }
  ```

#### Follow-up Assistant
- **POST** `/emails/ai/followup` - Generate follow-up emails
  ```json
  {
    "prompt": "Check in on our proposal",
    "recipientName": "Sarah",
    "previousContext": "Sent proposal last week"
  }
  ```

## AI Features

### Sales Assistant
- Generates professional sales emails
- Keeps emails under 40 words (readable in under 10 seconds)
- Uses 7-10 words per sentence maximum
- Tailors content to recipient's business context

### Follow-up Assistant
- Creates polite and non-pushy follow-up emails
- Maintains professional tone
- References previous context when provided
- Follows the same word count and sentence structure guidelines

### Smart Routing
- Automatically analyzes user prompts
- Routes to the most appropriate assistant
- Supports "sales" and "followup" categories

## Database Schema

The `emails` table includes:
- `id` - Primary key
- `to`, `cc`, `bcc` - Recipient fields
- `subject`, `body` - Email content
- `userFK` - User identifier (hardcoded to 'fastUser')
- `created_at`, `updated_at` - Timestamps

## Environment Variables

```env
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini
PORT=3001
NODE_ENV=development
```

## Development

- **Port**: 3001 (configurable via PORT env var)
- **Database**: SQLite with Knex.js
- **Framework**: Fastify
- **Module System**: ES Modules

## Scripts

- `npm run dev` - Start development server with nodemon
- `npm run migrate` - Run database migrations
- `npm start` - Start production server
- `npm run dev:env` - Setup environment file 