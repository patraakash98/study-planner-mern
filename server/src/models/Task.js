import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  taskName: { type: String, required: true, trim: true, maxlength: 150 },
  courseName: { type: String, required: true, trim: true, maxlength: 100 },
  topicName: { type: String, required: true, trim: true, maxlength: 150 },
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  durationMinutes: { type: Number, required: true, min: 1, max: 1440 },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' }
}, { timestamps: true, strict: 'throw' });

taskSchema.index({ createdAt: -1, _id: -1 });
export const Task = mongoose.model('Task', taskSchema);
