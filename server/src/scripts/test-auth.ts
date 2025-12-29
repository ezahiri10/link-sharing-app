import 'dotenv/config'
import { auth } from '../auth/better-auth.js';

async function test() {
  try {
    console.log('Testing Better Auth signup...');
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('BETTER_AUTH_SECRET exists:', !!process.env.BETTER_AUTH_SECRET);
    
    const result = await auth.api.signUpEmail({
      body: {
        email: 'test-better-auth@test.com',
        password: 'password123',
        name: 'Test User',
      },
    });
    
    console.log('Signup result:', result);
  } catch (error) {
    console.error('Error:', error);
  }
  
  process.exit(0);
}

test();
