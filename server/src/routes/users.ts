import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { uploadProfileImage, uploadCertificate } from '../middleware/upload';

const router = Router();

router.use(requireAuth);

router.get('/me', async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: {
      skills: { include: { skill: true } },
      interests: { include: { interest: true } },
      certificates: true,
      projects: true,
      hackathonHistory: true
    }
  });
  res.json(user);
});

router.put('/profile', async (req: AuthRequest, res: Response) => {
  const { name, college, branch, year, phone, organizationName } = req.body;
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { name, college, branch, year, phone, organizationName }
  });
  res.json(user);
});

router.post('/profile/photo', uploadProfileImage, async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { profileImage: req.file.path }
  });
  res.json(user);
});

router.post('/skills', async (req: AuthRequest, res: Response) => {
  const { name } = req.body;
  const skill = await prisma.skill.upsert({
    where: { name },
    update: {},
    create: { name }
  });
  const userSkill = await prisma.userSkill.create({
    data: { userId: req.user.id, skillId: skill.id }
  });
  res.json(userSkill);
});

router.delete('/skills/:id', async (req: AuthRequest, res: Response) => {
  await prisma.userSkill.delete({
    where: { id: parseInt(req.params.id) }
  });
  res.json({ success: true });
});

router.post('/interests', async (req: AuthRequest, res: Response) => {
  const { name } = req.body;
  const interest = await prisma.interest.upsert({
    where: { name },
    update: {},
    create: { name }
  });
  const userInterest = await prisma.userInterest.create({
    data: { userId: req.user.id, interestId: interest.id }
  });
  res.json(userInterest);
});

router.delete('/interests/:id', async (req: AuthRequest, res: Response) => {
  await prisma.userInterest.delete({
    where: { id: parseInt(req.params.id) }
  });
  res.json({ success: true });
});

router.post('/certificates', uploadCertificate, async (req: AuthRequest, res: Response) => {
  const { title, issuer, date, description } = req.body;
  const certificate = await prisma.certificate.create({
    data: {
      userId: req.user.id,
      title,
      issuer,
      date: new Date(date),
      description,
      image: req.file?.path
    }
  });
  res.json(certificate);
});

router.post('/projects', async (req: AuthRequest, res: Response) => {
  const { title, description, techStack, link, image } = req.body;
  const project = await prisma.project.create({
    data: {
      userId: req.user.id,
      title,
      description,
      techStack: techStack || [],
      link,
      image
    }
  });
  res.json(project);
});

router.post('/hackathon-history', async (req: AuthRequest, res: Response) => {
  const { name, date, position, teamName, project } = req.body;
  const history = await prisma.hackathonHistory.create({
    data: {
      userId: req.user.id,
      name,
      date: new Date(date),
      position,
      teamName,
      project
    }
  });
  res.json(history);
});

router.get('/search', async (req: AuthRequest, res: Response) => {
  const { q } = req.query;
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: String(q || ''), mode: 'insensitive' } },
        { skills: { some: { skill: { name: { contains: String(q || ''), mode: 'insensitive' } } } } }
      ]
    },
    include: {
      skills: { include: { skill: true } }
    },
    take: 20
  });
  res.json(users);
});

export default router;
