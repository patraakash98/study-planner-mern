import mongoose from 'mongoose';

const createFields = ['taskName', 'courseName', 'topicName', 'priority', 'durationMinutes'];
const statusFields = ['status'];
const priorities = new Set(['high', 'medium', 'low']);

function validateKeys(body, allowed) {
  const unknown = Object.keys(body ?? {}).filter((key) => !allowed.includes(key));
  return unknown.length ? `Unknown field: ${unknown[0]}` : null;
}

export function validateCreate(body) {
  const fields = {};
  const keyError = validateKeys(body, createFields);
  if (keyError) return { message: keyError };
  for (const [field, max] of [['taskName', 150], ['courseName', 100], ['topicName', 150]]) {
    if (typeof body?.[field] !== 'string' || !body[field].trim()) fields[field] = 'This field is required.';
    else if (body[field].trim().length > max) fields[field] = `Use ${max} characters or fewer.`;
  }
  if (body?.priority !== undefined && (typeof body.priority !== 'string' || !priorities.has(body.priority))) fields.priority = 'Choose high, medium, or low.';
  if (!Number.isInteger(body?.durationMinutes) || body.durationMinutes < 1 || body.durationMinutes > 1440) fields.durationMinutes = 'Enter a whole number from 1 to 1440.';
  return Object.keys(fields).length ? { fields } : { value: { taskName: body.taskName.trim(), courseName: body.courseName.trim(), topicName: body.topicName.trim(), priority: body.priority ?? 'medium', durationMinutes: body.durationMinutes } };
}

export function validateStatus(body) {
  const keyError = validateKeys(body, statusFields);
  if (keyError || body?.status !== 'completed') return { message: keyError || 'Only status: completed is accepted.' };
  return { value: { status: 'completed' } };
}

export function validateFilter(status) {
  return status === undefined || status === 'pending' || status === 'completed';
}

export function isValidId(id) { return mongoose.isObjectIdOrHexString(id); }
