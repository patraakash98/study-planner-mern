import { Router } from 'express';
import { completeTask, createTask, listTasks } from '../controllers/taskController.js';

const router = Router();
router.get('/', listTasks);
router.post('/', createTask);
router.patch('/:id/status', completeTask);
export default router;
