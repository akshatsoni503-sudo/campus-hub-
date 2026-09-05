import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/', async (req: AuthRequest, res: Response) => {
  const notifs = await prisma.notification.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' }
  });
  res.json(notifs);
});

router.put('/:id/read', async (req: AuthRequest, res: Response) => {
  const updated = await prisma.notification.updateMany({
    where: { id: parseInt(req.params.id), userId: req.user.id },
    data: { read: true }
  });
  res.json({ success: true, updated });
});

router.put('/read-all', async (req: AuthRequest, res: Response) => {
  const updated = await prisma.notification.updateMany({
    where: { userId: req.user.id, read: false },
    data: { read: true }
  });
  res.json({ success: true, updatedCount: updated.count });
});

router.get('/unread-count', async (req: AuthRequest, res: Response) => {
  const count = await prisma.notification.count({
    where: { userId: req.user.id, read: false }
  });
  res.json({ count });
});

export default router;
