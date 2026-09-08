import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// GET /api/quizzes/active
router.get('/active', async (_req: Request, res: Response) => {
  try {
    const quiz = await prisma.quiz.findFirst({
      where: { status: true },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          include: {
            answers: {
              select: {
                id: true,
                text: true,
                image: true,
                score: true,
              },
            },
          },
        },
      },
    });

    if (!quiz) {
      return res.status(404).json({ error: 'No active quiz campaign found.' });
    }

    return res.json(quiz);
  } catch (error: any) {
    console.error('Error fetching active quiz:', error);
    return res.status(500).json({ error: 'Failed to retrieve quiz details.', details: error.message });
  }
});

export default router;
