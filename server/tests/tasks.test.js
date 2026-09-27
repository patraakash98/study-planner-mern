import assert from 'node:assert/strict';
import { after, before, beforeEach, describe, it } from 'node:test';
import mongoose from 'mongoose';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApp } from '../src/app.js';
import { connectDatabase } from '../src/config/db.js';
import { Task } from '../src/models/Task.js';

const app = createApp();
let mongo;
const sample = { taskName: ' Read chapter ', courseName: ' Biology ', topicName: ' Cells ', durationMinutes: 30 };

describe('tasks API', () => {
  before(async () => { mongo = await MongoMemoryServer.create(); await connectDatabase(mongo.getUri()); });
  beforeEach(async () => { await Task.deleteMany({}); });
  after(async () => { await mongoose.disconnect(); await mongo.stop(); });

  it('creates a pending task with defaults and trims text', async () => {
    const response = await request(app).post('/api/tasks').send(sample).expect(201);
    assert.equal(response.body.task.taskName, 'Read chapter');
    assert.equal(response.body.task.priority, 'medium');
    assert.equal(response.body.task.status, 'pending');
  });

  it('rejects invalid values and unknown fields', async () => {
    const response = await request(app).post('/api/tasks').send({ ...sample, durationMinutes: 1.5, extra: true }).expect(400);
    assert.equal(response.body.error.code, 'VALIDATION_ERROR');
  });

  it('filters pending and completed tasks', async () => {
    const created = await request(app).post('/api/tasks').send(sample);
    await request(app).patch(`/api/tasks/${created.body.task._id}/status`).send({ status: 'completed' });
    assert.equal((await request(app).get('/api/tasks?status=pending')).body.tasks.length, 0);
    assert.equal((await request(app).get('/api/tasks?status=completed')).body.tasks.length, 1);
    assert.equal((await request(app).get('/api/tasks')).body.tasks.length, 1);
  });

  it('allows repeated completion and rejects unsupported filters', async () => {
    const created = await request(app).post('/api/tasks').send(sample);
    const path = `/api/tasks/${created.body.task._id}/status`;
    await request(app).patch(path).send({ status: 'completed' }).expect(200);
    await request(app).patch(path).send({ status: 'completed' }).expect(200);
    await request(app).get('/api/tasks?status=archived').expect(400);
  });

  it('distinguishes malformed and missing IDs', async () => {
    await request(app).patch('/api/tasks/not-an-id/status').send({ status: 'completed' }).expect(400);
    await request(app).patch('/api/tasks/507f1f77bcf86cd799439011/status').send({ status: 'completed' }).expect(404);
  });

  it('returns JSON for malformed request bodies', async () => {
    const response = await request(app).post('/api/tasks').set('Content-Type', 'application/json').send('{').expect(400);
    assert.equal(response.body.error.code, 'BAD_REQUEST');
  });
});
