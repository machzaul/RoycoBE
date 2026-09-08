import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// POST /api/analytics/log
router.post('/log', async (req: Request, res: Response) => {
  try {
    const { eventType, sessionId, quizId, device } = req.body;

    if (!eventType || !quizId) {
      return res.status(400).json({ error: 'eventType and quizId are required.' });
    }

    const event = await prisma.analyticsEvent.create({
      data: {
        eventType,
        sessionId: sessionId || null,
        quizId,
        device: device || null,
      },
    });

    return res.json({ success: true, eventId: event.id });
  } catch (error: any) {
    console.error('Error logging analytics event:', error);
    return res.status(500).json({ error: 'Failed to record event.', details: error.message });
  }
});

export default router;
