import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { requireAuth, requireVerified, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const { q } = req.query;
  const whereClause: any = { isPublic: true };
  if (q) {
    whereClause.OR = [
      { name: { contains: String(q), mode: 'insensitive' } },
      { projectTitle: { contains: String(q), mode: 'insensitive' } }
    ];
  }
  const teams = await prisma.team.findMany({
    where: whereClause,
    include: {
      _count: { select: { members: true } },
      requiredSkills: { include: { skill: true } },
      leader: { select: { id: true, name: true, college: true } }
    }
  });
  res.json(teams);
});

router.get('/my-teams', requireAuth, async (req: AuthRequest, res: Response) => {
  const teams = await prisma.team.findMany({
    where: {
      OR: [
        { leaderId: req.user.id },
        { members: { some: { userId: req.user.id } } }
      ]
    },
    include: { requiredSkills: { include: { skill: true } } }
  });
  res.json(teams);
});

router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  const teamId = parseInt(req.params.id);
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: {
      members: { include: { user: { select: { id: true, name: true, skills: { include: { skill: true } } } } } },
      requiredSkills: { include: { skill: true } },
      leader: { select: { id: true, name: true } },
      joinRequests: req.user ? { where: { team: { leaderId: req.user.id } }, include: { user: true } } : false
    }
  });
  if (!team) {
    res.status(404).json({ error: 'Team not found' });
    return;
  }
  res.json(team);
});

router.post('/', requireAuth, requireVerified, async (req: AuthRequest, res: Response) => {
  const { requiredSkills, ...teamData } = req.body;
  const team = await prisma.team.create({
    data: {
      ...teamData,
      leaderId: req.user.id,
      isPublic: true,
      currentSize: 1,
      members: {
        create: { userId: req.user.id, role: 'LEADER' }
      }
    }
  });

  if (requiredSkills) {
    for (const skillName of requiredSkills) {
      const skill = await prisma.skill.upsert({ where: { name: skillName }, update: {}, create: { name: skillName } });
      await prisma.teamSkill.create({ data: { teamId: team.id, skillId: skill.id } });
    }
  }

  res.status(201).json(team);
});

router.put('/:id', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const teamId = parseInt(req.params.id);
  const team = await prisma.team.findUnique({ where: { id: teamId } });
  if (!team || team.leaderId !== req.user.id) {
    res.status(403).json({ error: 'Not allowed' });
    return;
  }
  const updated = await prisma.team.update({ where: { id: teamId }, data: req.body });
  res.json(updated);
});

router.delete('/:id', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const teamId = parseInt(req.params.id);
  const team = await prisma.team.findUnique({ where: { id: teamId } });
  if (!team || team.leaderId !== req.user.id) {
    res.status(403).json({ error: 'Not allowed' });
    return;
  }
  await prisma.team.delete({ where: { id: teamId } });
  res.json({ success: true });
});

router.post('/:id/join', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const teamId = parseInt(req.params.id);
  const team = await prisma.team.findUnique({ where: { id: teamId }, include: { members: true, joinRequests: true } });
  if (!team) {
    res.status(404).json({ error: 'Team not found' });
    return;
  }
  if (team.currentSize >= team.maxSize) {
    res.status(400).json({ error: 'Team is full' });
    return;
  }
  if (team.members.some(m => m.userId === req.user.id)) {
    res.status(400).json({ error: 'Already a member' });
    return;
  }
  if (team.joinRequests.some(r => r.userId === req.user.id && r.status === 'PENDING')) {
    res.status(400).json({ error: 'Request already pending' });
    return;
  }

  const reqObj = await prisma.teamJoinRequest.create({
    data: { teamId, userId: req.user.id, message: req.body.message }
  });

  await prisma.notification.create({
    data: {
      userId: team.leaderId,
      type: 'TEAM_REQUEST',
      title: 'New Team Request',
      message: `${req.user.name} requested to join ${team.name}`,
      link: `/teams/${team.id}`
    }
  });

  res.json(reqObj);
});

router.get('/:id/requests', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const teamId = parseInt(req.params.id);
  const team = await prisma.team.findUnique({ where: { id: teamId } });
  if (!team || team.leaderId !== req.user.id) {
    res.status(403).json({ error: 'Not allowed' });
    return;
  }
  const requests = await prisma.teamJoinRequest.findMany({
    where: { teamId, status: 'PENDING' },
    include: { user: { select: { id: true, name: true, skills: { include: { skill: true } } } } }
  });
  res.json(requests);
});

router.put('/:id/requests/:requestId', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const { status } = req.body;
  const requestId = parseInt(req.params.requestId);
  const request = await prisma.teamJoinRequest.findUnique({ where: { id: requestId }, include: { team: true } });
  
  if (!request || request.team.leaderId !== req.user.id) {
    res.status(403).json({ error: 'Not allowed' });
    return;
  }

  await prisma.teamJoinRequest.update({
    where: { id: requestId },
    data: { status }
  });

  if (status === 'ACCEPTED') {
    await prisma.teamMember.create({ data: { teamId: request.teamId, userId: request.userId } });
    await prisma.team.update({ where: { id: request.teamId }, data: { currentSize: { increment: 1 } } });
    
    await prisma.notification.create({
      data: {
        userId: request.userId,
        type: 'TEAM_ACCEPTED',
        title: 'Team Request Accepted',
        message: `Your request to join ${request.team.name} was accepted`,
        link: `/teams/${request.teamId}`
      }
    });
  } else if (status === 'REJECTED') {
    await prisma.notification.create({
      data: {
        userId: request.userId,
        type: 'TEAM_REJECTED',
        title: 'Team Request Rejected',
        message: `Your request to join ${request.team.name} was rejected`
      }
    });
  }

  res.json({ success: true });
});

export default router;
