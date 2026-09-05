import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

router.use(requireAuth, requireRole('ADMIN'));

router.get('/stats', async (req: Request, res: Response) => {
  const [users, events, teams, clubs, pendingVerifications] = await Promise.all([
    prisma.user.count(),
    prisma.event.count(),
    prisma.team.count(),
    prisma.club.count(),
    prisma.user.count({ where: { verificationStatus: 'PENDING' } })
  ]);
  res.json({ users, events, teams, clubs, pendingVerifications });
});

router.get('/users', async (req: Request, res: Response) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const users = await prisma.user.findMany({
    skip,
    take: Number(limit),
    orderBy: { createdAt: 'desc' }
  });
  res.json(users);
});

router.get('/verifications', async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    where: { verificationStatus: 'PENDING' },
    orderBy: { createdAt: 'asc' }
  });
  res.json(users);
});

router.put('/verifications/:id', async (req: Request, res: Response) => {
  const { status } = req.body;
  const userId = parseInt(req.params.id);
  
  const user = await prisma.user.update({
    where: { id: userId },
    data: { verificationStatus: status }
  });

  await prisma.notification.create({
    data: {
      userId,
      type: 'VERIFICATION_UPDATE',
      title: 'Verification Update',
      message: `Your account verification status has been updated to ${status}`
    }
  });

  res.json(user);
});

router.get('/events', async (req: Request, res: Response) => {
  const events = await prisma.event.findMany({
    orderBy: { createdAt: 'desc' }
  });
  res.json(events);
});

router.delete('/events/:id', async (req: Request, res: Response) => {
  await prisma.event.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ success: true });
});

router.put('/users/:id/role', async (req: Request, res: Response) => {
  const { role } = req.body;
  const user = await prisma.user.update({
    where: { id: parseInt(req.params.id) },
    data: { role }
  });
  res.json(user);
});

export default router;
