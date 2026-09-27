import express from 'express';
import taskRoutes from './routes/taskRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();
  app.use(express.json({ strict: true }));
  app.get('/api/health', (_request, response) => response.json({ ok: true }));
  app.use('/api/tasks', taskRoutes);
  app.use((_request, response) => response.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found.' } }));
  app.use(errorHandler);
  return app;
}
