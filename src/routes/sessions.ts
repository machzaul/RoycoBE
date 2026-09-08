import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { calculateResult } from '../lib/scoring';
import { generateReceiptEscPos, printToBlueprintQ58D } from '../lib/printer';

const router = Router();

function generateToken(length = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// POST /api/sessions/start
router.post('/start', async (req: Request, res: Response) => {
  try {
    const { name, phone, email, consent, newsletter, quizId } = req.body;

    if (!name || !phone || !quizId) {
      return res.status(400).json({ error: 'Name, phone number, and quiz ID are required.' });
    }

    let participant = await prisma.participant.findFirst({
      where: { phone },
    });

    if (participant) {
      participant = await prisma.participant.update({
        where: { id: participant.id },
        data: { name, phone, email: email || null, consent, newsletter },
      });
    } else {
      participant = await prisma.participant.create({
        data: { name, phone, email: email || null, consent, newsletter },
      });
    }

    let token = generateToken();
    let tokenExists = await prisma.quizSession.findUnique({ where: { token } });
    while (tokenExists) {
      token = generateToken();
      tokenExists = await prisma.quizSession.findUnique({ where: { token } });
    }

    const session = await prisma.quizSession.create({
      data: {
        quizId,
        participantId: participant.id,
        answers: [],
        token,
      },
    });

    await prisma.analyticsEvent.create({
      data: {
        quizId,
        sessionId: session.id,
        eventType: 'START',
      },
    });

    return res.json({
      sessionId: session.id,
      token: session.token,
    });
  } catch (error: any) {
    console.error('Error starting session:', error);
    return res.status(500).json({ error: 'Failed to initialize session.', details: error.message });
  }
});

// POST /api/sessions/submit
router.post('/submit', async (req: Request, res: Response) => {
  try {
    const { sessionId, answerIds } = req.body;

    if (!sessionId || !answerIds || !Array.isArray(answerIds) || answerIds.length === 0) {
      return res.status(400).json({ error: 'Session ID and a non-empty array of answer IDs are required.' });
    }

    const session = await prisma.quizSession.findUnique({
      where: { id: sessionId },
      include: { quiz: true },
    });

    if (!session) {
      return res.status(404).json({ error: 'Quiz session not found.' });
    }

    const answers = await prisma.answer.findMany({
      where: { id: { in: answerIds } },
      select: {
        id: true,
        resultMapping: true,
        score: true,
      },
    });

    if (answers.length === 0) {
      return res.status(404).json({ error: 'No valid answers found for the provided IDs.' });
    }

    const resultOptions = await prisma.resultOption.findMany({
      where: { quizId: session.quizId },
    });

    if (resultOptions.length === 0) {
      return res.status(500).json({ error: 'No result templates configured for this quiz.' });
    }

    const winningResult = calculateResult(answers, resultOptions);

    let queueNumber = session.queueNumber;
    if (!queueNumber) {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const lastSessionToday = await prisma.quizSession.findFirst({
        where: {
          queueNumber: { not: null },
          createdAt: { gte: todayStart },
        },
        orderBy: { queueNumber: 'desc' },
      });

      queueNumber = (lastSessionToday?.queueNumber ?? 0) + 1;
    }

    const updatedSession = await prisma.quizSession.update({
      where: { id: sessionId },
      data: {
        answers: answerIds,
        resultId: winningResult.id,
        queueNumber,
        completedAt: new Date(),
      },
      include: {
        result: true,
        participant: true,
      },
    });

    await prisma.analyticsEvent.create({
      data: {
        quizId: session.quizId,
        sessionId: session.id,
        eventType: 'COMPLETE',
      },
    });

    return res.json({
      success: true,
      token: updatedSession.token,
      result: updatedSession.result,
      participant: updatedSession.participant,
      queueNumber: updatedSession.queueNumber,
      isPrinted: updatedSession.isPrinted,
    });
  } catch (error: any) {
    console.error('Error submitting quiz answers:', error);
    return res.status(500).json({ error: 'Failed to process quiz submission.', details: error.message });
  }
});

// GET /api/sessions/result/:token
router.get('/result/:token', async (req: Request, res: Response) => {
  try {
    const token = String(req.params.token);

    const session = await prisma.quizSession.findUnique({
      where: { token },
      include: {
        participant: true,
        result: true,
        quiz: true,
      },
    });

    if (!session) {
      return res.status(404).json({ error: 'Quiz session not found.' });
    }

    return res.json(session);
  } catch (error: any) {
    console.error('Error fetching session result:', error);
    return res.status(500).json({ error: 'Failed to fetch result.', details: error.message });
  }
});

// POST /api/sessions/print
router.post('/print', async (req: Request, res: Response) => {
  try {
    const { sessionId, token } = req.body;

    if (!sessionId && !token) {
      return res.status(400).json({ error: 'Session ID atau token diperlukan untuk mencetak struk.' });
    }

    const session = await prisma.quizSession.findFirst({
      where: sessionId ? { id: sessionId } : { token },
      include: {
        participant: true,
        result: true,
      },
    });

    if (!session) {
      return res.status(404).json({ error: 'Sesi kuis tidak ditemukan.' });
    }

    if (session.isPrinted) {
      return res.status(400).json({
        error: 'Struk sudah pernah dicetak untuk sesi ini. Maksimal 1 kali cetak per sesi.',
        isPrinted: true,
        queueNumber: session.queueNumber,
        printedAt: session.printedAt,
      });
    }

    let queueNumber = session.queueNumber;
    if (!queueNumber) {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const lastSessionToday = await prisma.quizSession.findFirst({
        where: {
          queueNumber: { not: null },
          createdAt: { gte: todayStart },
        },
        orderBy: { queueNumber: 'desc' },
      });

      queueNumber = (lastSessionToday?.queueNumber ?? 0) + 1;
    }

    const participantName = session.participant?.name || 'PESERTA';
    const resultTitle = session.result?.title || 'ACT OF SERVICE';

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeFormatted = `[${hours}.${minutes}]`;

    const escposBuffer = generateReceiptEscPos({
      name: participantName,
      resultTitle,
      queueNumber,
      time: timeFormatted,
    });

    try {
      await printToBlueprintQ58D(escposBuffer);
    } catch (printErr: any) {
      console.error('Printer execution error:', printErr);
      return res.status(500).json({
        error: `Gagal mencetak ke printer Blueprint BP-Q58D: ${printErr.message || 'Printer tidak merespon'}. Pastikan kabel USB terhubung dan printer menyala.`,
        isPrinted: false,
      });
    }

    const updatedSession = await prisma.quizSession.update({
      where: { id: session.id },
      data: {
        isPrinted: true,
        printedAt: new Date(),
        queueNumber,
      },
    });

    await prisma.analyticsEvent.create({
      data: {
        quizId: session.quizId,
        sessionId: session.id,
        eventType: 'PRINT_RECEIPT',
      },
    });

    return res.json({
      success: true,
      isPrinted: true,
      queueNumber: updatedSession.queueNumber,
      printedAt: updatedSession.printedAt,
      receiptPreview: {
        name: participantName.toUpperCase(),
        resultTitle: resultTitle === 'Acts of Service' ? '[ACT OF SERVICE]' : `[${resultTitle.toUpperCase()}]`,
        queueNumber: String(queueNumber).padStart(3, '0'),
        time: timeFormatted,
      },
    });
  } catch (error: any) {
    console.error('Error in print route:', error);
    return res.status(500).json({ error: 'Terjadi kesalahan sistem saat memproses cetak struk.', details: error.message });
  }
});

export default router;
