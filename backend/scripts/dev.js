#!/usr/bin/env node

import { execSync } from 'child_process';
import { spawn } from 'child_process';

console.log('🚀 Starting development server...');

try {
  // Run migrations first
  console.log('📊 Running database migrations...');
  execSync('npx knex migrate:latest', { stdio: 'inherit' });
  console.log('✅ Migrations completed successfully');
  
  // Start the dev server
  console.log('🔄 Starting nodemon...');
  const devProcess = spawn('nodemon', ['index.js'], {
    stdio: 'inherit',
    env: { ...process.env, PORT: '3001' }
  });
  
  devProcess.on('error', (error) => {
    console.error('❌ Failed to start nodemon:', error);
    process.exit(1);
  });
  
} catch (error) {
  console.error('❌ Failed to run migrations:', error);
  process.exit(1);
} 