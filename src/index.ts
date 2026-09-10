import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import path from 'path';
import cardsRouter from './routes/cards';
import resultPageRouter from './routes/resultPage';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Serve static assets (card images, fonts) from public folder
app.use(express.static(path.join(process.cwd(), 'public')));

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'OK', message: 'Royco Card Server is running', timestamp: new Date().toISOString() });
});

// Mobile Scan Result Page (matching user reference design with Download & Share)
app.use('/result', resultPageRouter);

// API Cards (static card definitions)
app.use('/api/cards', cardsRouter);

// Root default route
app.get('/', (_req, res) => {
  res.redirect('/result/acts-of-service');
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Standalone Backend server is running at http://localhost:${PORT}`);
  });
}

export default app;
