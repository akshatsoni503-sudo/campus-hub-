import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const { q } = req.query;
  const query = String(q || '');
  
  if (!query) {
    res.json({ events: [], teams: [], clubs: [], users: [] });
    return;
  }

  const [events, teams, clubs, users] = await Promise.all([
    prisma.event.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      },
      take: 5
    }),
    prisma.team.findMany({
      where: {
        isPublic: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { projectTitle: { contains: query, mode: 'insensitive' } }
        ]
      },
      take: 5
    }),
    prisma.club.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      },
      take: 5
    }),
    prisma.user.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' }
      },
      select: { id: true, name: true, college: true, profileImage: true },
      take: 5
    })
  ]);

  res.json({ events, teams, clubs, users });
});

export default router;
