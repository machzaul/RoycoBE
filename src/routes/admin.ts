import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';

const router = Router();

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const secret = process.env.ADMIN_PASSWORD || 'adminpass123';
  if (token !== secret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// POST /api/admin/auth
router.post('/auth', (req: Request, res: Response) => {
  const { password } = req.body;
  const secret = process.env.ADMIN_PASSWORD || 'adminpass123';
  if (password === secret) {
    return res.json({ success: true, token: secret });
  }
  return res.status(401).json({ error: 'Password salah' });
});

// GET /api/admin/analytics/summary
router.get('/analytics/summary', authMiddleware, async (_req: Request, res: Response) => {
  try {
    const totalParticipants = await prisma.participant.count();
    const totalCompleted = await prisma.quizSession.count({
      where: { completedAt: { not: null } },
    });
    const downloadCount = await prisma.analyticsEvent.count({
      where: { eventType: 'DOWNLOAD' },
    });
    const shareCount = await prisma.analyticsEvent.count({
      where: { eventType: { in: ['SHARE_IG', 'SHARE_WA', 'SHARE_NATIVE'] } },
    });
    const qrScanCount = await prisma.analyticsEvent.count({
      where: { eventType: 'QR_SCAN' },
    });

    return res.json({
      totalParticipants,
      totalCompleted,
      downloadCount,
      shareCount,
      qrScanCount,
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to retrieve analytics summary.', details: error.message });
  }
});

// GET /api/admin/analytics/distribution
router.get('/analytics/distribution', authMiddleware, async (_req: Request, res: Response) => {
  try {
    const results = await prisma.resultOption.findMany({
      include: {
        _count: {
          select: { sessions: true },
        },
      },
    });

    const distribution = results.map((r) => ({
      id: r.id,
      code: r.code,
      title: r.title,
      count: r._count.sessions,
    }));

    return res.json(distribution);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to retrieve distribution.', details: error.message });
  }
});

export default router;
