import 'dotenv/config';
import { createApp } from './app.js';
import { connectDatabase } from './config/db.js';

const port = Number(process.env.PORT || 5000);
const host = process.env.HOST || '127.0.0.1';
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/study_planner';

try {
  await connectDatabase(mongoUri);
  createApp().listen(port, host, () => console.log(`Study Planner API running at http://${host}:${port}`));
} catch (error) {
  console.error('Could not connect to MongoDB:', error.message);
  process.exitCode = 1;
}
