import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.post('/chat', async (req: AuthRequest, res: Response) => {
  const { message, chatId } = req.body;
  let currentChatId = chatId;

  if (!currentChatId) {
    const chat = await prisma.chat.create({
      data: { userId: req.user.id, title: message.substring(0, 30) }
    });
    currentChatId = chat.id;
  }

  await prisma.chatMessage.create({
    data: { chatId: currentChatId, role: 'user', content: message }
  });

  const msgLower = message.toLowerCase();
  let responseContent = 'I can help you find events, clubs, or teams. Try asking about "upcoming hackathons" or "tech clubs".';

  if (msgLower.match(/event|hackathon|workshop|competition|seminar/)) {
    const events = await prisma.event.findMany({
      where: { status: 'PUBLISHED' },
      take: 3,
      orderBy: { date: 'asc' }
    });
    if (events.length > 0) {
      responseContent = 'Here are some upcoming events:\n' + events.map(e => `- ${e.title} on ${e.date.toDateString()}`).join('\n');
    } else {
      responseContent = 'I couldn\'t find any upcoming events right now.';
    }
  } else if (msgLower.match(/club|coding|tech/)) {
    const clubs = await prisma.club.findMany({ take: 3, orderBy: { memberCount: 'desc' } });
    if (clubs.length > 0) {
      responseContent = 'Here are some popular clubs:\n' + clubs.map(c => `- ${c.name} (${c.memberCount} members)`).join('\n');
    }
  } else if (msgLower.match(/team|project/)) {
    const teams = await prisma.team.findMany({ where: { isPublic: true }, take: 3 });
    if (teams.length > 0) {
      responseContent = 'Here are some teams looking for members:\n' + teams.map(t => `- ${t.name}`).join('\n');
    }
  } else if (msgLower.match(/registered|mera|my/)) {
    const regs = await prisma.eventRegistration.findMany({
      where: { userId: req.user.id },
      include: { event: true }
    });
    if (regs.length > 0) {
      responseContent = 'You are registered for:\n' + regs.map(r => `- ${r.event.title}`).join('\n');
    } else {
      responseContent = 'You are not registered for any events yet.';
    }
  }

  const assistantMsg = await prisma.chatMessage.create({
    data: { chatId: currentChatId, role: 'assistant', content: responseContent }
  });

  res.json({ chatId: currentChatId, response: assistantMsg });
});

router.get('/chats', async (req: AuthRequest, res: Response) => {
  const chats = await prisma.chat.findMany({
    where: { userId: req.user.id },
    orderBy: { updatedAt: 'desc' }
  });
  res.json(chats);
});

router.get('/chats/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  const chat = await prisma.chat.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { messages: { orderBy: { createdAt: 'asc' } } }
  });
  if (!chat || chat.userId !== req.user.id) {
    res.status(404).json({ error: 'Chat not found' });
    return;
  }
  res.json(chat);
});

router.delete('/chats/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  const chat = await prisma.chat.findUnique({ where: { id: parseInt(req.params.id) } });
  if (!chat || chat.userId !== req.user.id) {
    res.status(403).json({ error: 'Not allowed' });
    return;
  }
  await prisma.chat.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ success: true });
});

export default router;
