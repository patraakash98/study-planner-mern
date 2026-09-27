import { Task } from '../models/Task.js';
import { createError } from '../middleware/errorHandler.js';
import { isDatabaseError } from '../config/db.js';
import { isValidId, validateCreate, validateFilter, validateStatus } from '../validation/taskValidation.js';

function runDatabase(operation) { return operation().catch((error) => { if (isDatabaseError(error)) throw createError(503, 'DATABASE_UNAVAILABLE', 'The database is unavailable.'); throw error; }); }

export function listTasks(request, response, next) {
  const { status } = request.query;
  if (!validateFilter(status)) return next(createError(400, 'VALIDATION_ERROR', 'Status must be pending or completed.'));
  return runDatabase(() => Task.find(status ? { status } : {}).sort({ createdAt: -1, _id: -1 }).lean()).then((tasks) => response.json({ tasks })).catch(next);
}

export function createTask(request, response, next) {
  const result = validateCreate(request.body);
  if (!result.value) return next(createError(400, 'VALIDATION_ERROR', result.message || 'Please correct the highlighted fields.', result.fields));
  return runDatabase(() => Task.create(result.value)).then((task) => response.status(201).json({ task })).catch(next);
}

export function completeTask(request, response, next) {
  if (!isValidId(request.params.id)) return next(createError(400, 'INVALID_ID', 'Task ID is malformed.'));
  const result = validateStatus(request.body);
  if (!result.value) return next(createError(400, 'VALIDATION_ERROR', result.message));
  return runDatabase(() => Task.findByIdAndUpdate(request.params.id, { $set: result.value }, { new: true, runValidators: true })).then((task) => {
    if (!task) throw createError(404, 'TASK_NOT_FOUND', 'Task was not found.');
    return response.json({ task });
  }).catch(next);
}
