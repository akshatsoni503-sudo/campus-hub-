import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const clubs = await prisma.club.findMany({
    orderBy: { memberCount: 'desc' }
  });
  res.json(clubs);
});

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const club = await prisma.club.findUnique({
    where: { id: parseInt(req.params.id) },
    include: {
      events: { where: { status: 'PUBLISHED' }, take: 5 },
      announcements: { orderBy: { createdAt: 'desc' }, take: 5 }
    }
  });
  if (!club) {
    res.status(404).json({ error: 'Club not found' });
    return;
  }
  res.json(club);
});

router.post('/', requireAuth, requireRole('EVENT_MANAGER', 'ADMIN'), async (req: AuthRequest, res: Response) => {
  const club = await prisma.club.create({
    data: { ...req.body, createdById: req.user.id }
  });
  res.status(201).json(club);
});

router.post('/:id/follow', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const clubId = parseInt(req.params.id);
  const existing = await prisma.clubFollower.findUnique({
    where: { userId_clubId: { userId: req.user.id, clubId } }
  });

  if (existing) {
    await prisma.clubFollower.delete({ where: { id: existing.id } });
    await prisma.club.update({ where: { id: clubId }, data: { memberCount: { decrement: 1 } } });
    res.json({ following: false });
  } else {
    await prisma.clubFollower.create({ data: { userId: req.user.id, clubId } });
    await prisma.club.update({ where: { id: clubId }, data: { memberCount: { increment: 1 } } });
    res.json({ following: true });
  }
});

router.post('/:id/announcements', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const clubId = parseInt(req.params.id);
  const club = await prisma.club.findUnique({ where: { id: clubId }, include: { followers: true } });
  if (!club || club.createdById !== req.user.id) {
    res.status(403).json({ error: 'Not allowed' });
    return;
  }

  const { title, content } = req.body;
  const ann = await prisma.clubAnnouncement.create({ data: { clubId, title, content } });

  const notifications = club.followers.map(f => ({
    userId: f.userId,
    type: 'CLUB_ANNOUNCEMENT' as any,
    title: `New announcement from ${club.name}`,
    message: title,
    link: `/clubs/${clubId}`
  }));

  if (notifications.length > 0) {
    await prisma.notification.createMany({ data: notifications });
  }

  res.json(ann);
});

export default router;
