import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './routers/index.js';
import { createContext } from './trpc.js';

const app = express();
const port = process.env.PORT || 3000;

// CORS must be first
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// tRPC endpoint
app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
    onError: ({ error, type, path }) => {
      console.error('❌ tRPC Error:', { 
        type, 
        path, 
        message: error.message,
        code: error.code 
      });
    },
  })
);

// Catch-all for debugging
app.use('*', (req, res) => {
  console.log('❌ Unhandled route:', req.method, req.originalUrl);
  res.status(404).json({ 
    error: 'Not found', 
    path: req.originalUrl,
    message: 'This endpoint does not exist. tRPC endpoints should go to /trpc/*'
  });
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
  console.log(`📡 tRPC endpoint: http://localhost:${port}/trpc`);
});