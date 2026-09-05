import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Load env from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import eventRoutes from './routes/events';
import teamRoutes from './routes/teams';
import clubRoutes from './routes/clubs';
import notificationRoutes from './routes/notifications';
import copilotRoutes from './routes/copilot';
import adminRoutes from './routes/admin';
import searchRoutes from './routes/search';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for uploads
app.use('/uploads', express.static(path.resolve(__dirname, '../../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/copilot', copilotRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/search', searchRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
