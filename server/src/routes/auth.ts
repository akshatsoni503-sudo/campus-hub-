import { Router, Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { uploadCollegeId } from '../middleware/upload';

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string(),
  role: z.enum(['STUDENT', 'EVENT_MANAGER', 'ADMIN']).optional(),
  skills: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional()
});

router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const data = registerSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      res.status(400).json({ error: 'Email already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: data.role as any || 'STUDENT',
        emailOtp: '123456',
        emailOtpExpiry: new Date(Date.now() + 10 * 60 * 1000)
      }
    });

    if (data.skills && data.skills.length > 0) {
      for (const skillName of data.skills) {
        const skill = await prisma.skill.upsert({
          where: { name: skillName },
          update: {},
          create: { name: skillName }
        });
        await prisma.userSkill.create({
          data: { userId: user.id, skillId: skill.id }
        });
      }
    }

    if (data.interests && data.interests.length > 0) {
      for (const interestName of data.interests) {
        const interest = await prisma.interest.upsert({
          where: { name: interestName },
          update: {},
          create: { name: interestName }
        });
        await prisma.userInterest.create({
          data: { userId: user.id, interestId: interest.id }
        });
      }
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: 'Registration failed', details: error });
  }
});

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/verify-email', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.emailOtp !== otp) {
      res.status(400).json({ error: 'Invalid OTP' });
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, emailOtp: null, emailOtpExpiry: null }
    });

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

router.post('/upload-college-id', requireAuth, uploadCollegeId, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const verificationStatus = user.emailVerified ? 'PENDING' : user.verificationStatus;

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        collegeIdDocument: req.file.path,
        verificationStatus: verificationStatus as any
      }
    });
    res.json({ user: updated });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

router.get('/me', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: {
      skills: { include: { skill: true } },
      interests: { include: { interest: true } }
    }
  });
  res.json(user);
});

export default router;
