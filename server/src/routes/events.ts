import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { requireAuth, requireRole, requireVerified, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const { q, category, startDate, endDate, page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const whereClause: any = { status: 'PUBLISHED' };
  if (q) whereClause.OR = [{ title: { contains: String(q), mode: 'insensitive' } }, { description: { contains: String(q), mode: 'insensitive' } }];
  if (category) whereClause.category = category;
  if (startDate || endDate) {
    whereClause.date = {};
    if (startDate) whereClause.date.gte = new Date(String(startDate));
    if (endDate) whereClause.date.lte = new Date(String(endDate));
  }

  const events = await prisma.event.findMany({
    where: whereClause,
    include: {
      _count: { select: { registrations: true } },
      requiredSkills: { include: { skill: true } },
      requiredInterests: { include: { interest: true } }
    },
    skip,
    take: Number(limit),
    orderBy: { date: 'asc' }
  });
  res.json(events);
});

router.get('/recommended', requireAuth, async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { skills: { include: { skill: true } }, interests: { include: { interest: true } } }
  });
  if (!user) return;

  const userSkills = user.skills.map(s => s.skill.name);
  const userInterests = user.interests.map(i => i.interest.name);
  
  const events = await prisma.event.findMany({
    where: { status: 'PUBLISHED' },
    include: { requiredSkills: { include: { skill: true } }, requiredInterests: { include: { interest: true } } }
  });

  const scoredEvents = events.map(event => {
    const eventSkills = event.requiredSkills.map(s => s.skill.name);
    const eventInterests = event.requiredInterests.map(i => i.interest.name);

    let skillScore = 0;
    if (eventSkills.length > 0) {
      const match = eventSkills.filter(s => userSkills.includes(s)).length;
      skillScore = (match / eventSkills.length) * 40;
    }

    let interestScore = 0;
    if (eventInterests.length > 0) {
      const match = eventInterests.filter(i => userInterests.includes(i)).length;
      interestScore = (match / eventInterests.length) * 30;
    }

    let branchScore = 15;
    if (event.branchRestrictions.length > 0 && user.branch) {
      branchScore = event.branchRestrictions.includes(user.branch) ? 15 : 0;
    }

    let yearScore = 15;
    if (event.yearRestrictions.length > 0 && user.year) {
      yearScore = event.yearRestrictions.includes(user.year) ? 15 : 0;
    }

    return { ...event, matchPercentage: skillScore + interestScore + branchScore + yearScore };
  });

  scoredEvents.sort((a, b) => b.matchPercentage - a.matchPercentage);
  res.json(scoredEvents);
});

router.get('/closing-soon', requireAuth, async (req: AuthRequest, res: Response) => {
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const events = await prisma.event.findMany({
    where: {
      status: 'PUBLISHED',
      registrationDeadline: { gte: new Date(), lte: nextWeek }
    },
    orderBy: { registrationDeadline: 'asc' }
  });
  res.json(events);
});

router.get('/my-registrations', requireAuth, async (req: AuthRequest, res: Response) => {
  const registrations = await prisma.eventRegistration.findMany({
    where: { userId: req.user.id },
    include: { event: true }
  });
  res.json(registrations.map(r => r.event));
});

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const event = await prisma.event.findUnique({
    where: { id: parseInt(req.params.id) },
    include: {
      _count: { select: { registrations: true } },
      requiredSkills: { include: { skill: true } },
      requiredInterests: { include: { interest: true } },
      creator: { select: { id: true, name: true } }
    }
  });
  if (!event) {
    res.status(404).json({ error: 'Event not found' });
    return;
  }
  res.json(event);
});

router.get('/:id/compatibility', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const event = await prisma.event.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { requiredSkills: { include: { skill: true } }, requiredInterests: { include: { interest: true } } }
  });
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { skills: { include: { skill: true } }, interests: { include: { interest: true } } }
  });
  if (!event || !user) {
    res.status(404).json({ error: 'Not found' });
    return;
  }

  const userSkills = user.skills.map(s => s.skill.name);
  const eventSkills = event.requiredSkills.map(s => s.skill.name);
  
  const matchingSkills = eventSkills.filter(s => userSkills.includes(s));
  const missingSkills = eventSkills.filter(s => !userSkills.includes(s));
  
  const skillsAlignment = eventSkills.length ? (matchingSkills.length / eventSkills.length) * 100 : 100;
  
  const userInterests = user.interests.map(i => i.interest.name);
  const eventInterests = event.requiredInterests.map(i => i.interest.name);
  const matchingInterests = eventInterests.filter(i => userInterests.includes(i));
  
  const interestsAlignment = eventInterests.length ? (matchingInterests.length / eventInterests.length) * 100 : 100;

  const overall = (skillsAlignment * 0.6) + (interestsAlignment * 0.4);

  res.json({
    overallMatch: Math.round(overall),
    skillsAlignment: Math.round(skillsAlignment),
    interestsAlignment: Math.round(interestsAlignment),
    matchingSkills,
    missingSkills
  });
});

router.post('/', requireAuth, requireRole('EVENT_MANAGER', 'ADMIN'), requireVerified, async (req: AuthRequest, res: Response) => {
  const { requiredSkills, requiredInterests, ...eventData } = req.body;
  
  const event = await prisma.event.create({
    data: {
      ...eventData,
      createdById: req.user.id,
      date: new Date(eventData.date),
      registrationStart: new Date(eventData.registrationStart),
      registrationDeadline: new Date(eventData.registrationDeadline)
    }
  });

  if (requiredSkills) {
    for (const skillName of requiredSkills) {
      const skill = await prisma.skill.upsert({ where: { name: skillName }, update: {}, create: { name: skillName } });
      await prisma.eventSkill.create({ data: { eventId: event.id, skillId: skill.id } });
    }
  }

  if (requiredInterests) {
    for (const intName of requiredInterests) {
      const interest = await prisma.interest.upsert({ where: { name: intName }, update: {}, create: { name: intName } });
      await prisma.eventInterest.create({ data: { eventId: event.id, interestId: interest.id } });
    }
  }

  res.status(201).json(event);
});

router.put('/:id', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const eventId = parseInt(req.params.id);
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event || event.createdById !== req.user.id) {
    res.status(403).json({ error: 'Not allowed' });
    return;
  }
  const updated = await prisma.event.update({ where: { id: eventId }, data: req.body });
  res.json(updated);
});

router.delete('/:id', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const eventId = parseInt(req.params.id);
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event || (event.createdById !== req.user.id && req.user.role !== 'ADMIN')) {
    res.status(403).json({ error: 'Not allowed' });
    return;
  }
  await prisma.event.delete({ where: { id: eventId } });
  res.json({ success: true });
});

router.post('/:id/register', requireAuth, requireVerified, async (req: AuthRequest, res: Response): Promise<void> => {
  const eventId = parseInt(req.params.id);
  const event = await prisma.event.findUnique({ 
    where: { id: eventId },
    include: { _count: { select: { registrations: true } } }
  });

  if (!event || event.status !== 'PUBLISHED') {
    res.status(400).json({ error: 'Event not available' });
    return;
  }
  if (new Date() > new Date(event.registrationDeadline)) {
    res.status(400).json({ error: 'Registration closed' });
    return;
  }
  if (event.maxParticipants && event._count.registrations >= event.maxParticipants) {
    res.status(400).json({ error: 'Event full' });
    return;
  }

  const existing = await prisma.eventRegistration.findUnique({ where: { userId_eventId: { userId: req.user.id, eventId } } });
  if (existing) {
    res.status(400).json({ error: 'Already registered' });
    return;
  }

  const reg = await prisma.eventRegistration.create({
    data: { userId: req.user.id, eventId }
  });

  await prisma.notification.create({
    data: {
      userId: req.user.id,
      type: 'EVENT_REGISTRATION',
      title: 'Registration Successful',
      message: `You have successfully registered for ${event.title}`,
      link: `/events/${event.id}`
    }
  });

  res.json({ success: true, registration: reg });
});

router.get('/:id/registrations', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const eventId = parseInt(req.params.id);
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event || (event.createdById !== req.user.id && req.user.role !== 'ADMIN')) {
    res.status(403).json({ error: 'Not allowed' });
    return;
  }
  const registrations = await prisma.eventRegistration.findMany({
    where: { eventId },
    include: { user: { select: { id: true, name: true, email: true, college: true } } }
  });
  res.json(registrations);
});

export default router;
