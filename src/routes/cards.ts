import { Router, Request, Response } from 'express';
import { ALL_CARDS, getCardByIdOrSlug } from '../lib/cards';

const router = Router();

// GET /api/cards
router.get('/', (_req: Request, res: Response) => {
  return res.json(ALL_CARDS);
});

// GET /api/cards/:identifier
router.get('/:identifier', (req: Request, res: Response) => {
  const identifier = String(req.params.identifier);
  const card = getCardByIdOrSlug(identifier);

  if (!card) {
    return res.status(404).json({ error: 'Card not found' });
  }

  return res.json(card);
});

export default router;
