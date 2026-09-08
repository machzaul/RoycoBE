import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import quizRouter from './routes/quizzes';
import sessionsRouter from './routes/sessions';
import analyticsRouter from './routes/analytics';
import adminRouter from './routes/admin';
import path from 'path';
import cardsRouter from './routes/cards';
import resultPageRouter from './routes/resultPage';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Serve static assets (card images etc) from public folder
app.use(express.static(path.join(process.cwd(), 'public')));

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Mobile Scan Result Page (matching user reference design)
app.use('/result', resultPageRouter);

// API Routes
app.use('/api/quizzes', quizRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/cards', cardsRouter);

app.listen(PORT, () => {
  console.log(`🚀 Standalone Backend server is running at http://localhost:${PORT}`);
});

export default app;
