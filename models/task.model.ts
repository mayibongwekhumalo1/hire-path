import mongoose, { Schema, Document } from 'mongoose';
import { Task, Priority, TaskCategory } from '@/types/hire.types';

export interface ITask extends Omit<Task, '_id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const TaskSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  assignedTo: {
    type: String,
    required: true,
    trim: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'MEDIUM'
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['IT', 'FACILITIES', 'HR', 'SECURITY', 'MANAGER', 'COMPLIANCE', 'TRAINING'],
    required: true
  },
  hireId: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for id
TaskSchema.virtual('id').get(function(this: ITask) {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised
TaskSchema.set('toJSON', {
  virtuals: true
});

// Index for better query performance
TaskSchema.index({ hireId: 1 });
TaskSchema.index({ assignedTo: 1 });
TaskSchema.index({ dueDate: 1 });
TaskSchema.index({ completed: 1 });
TaskSchema.index({ category: 1 });
TaskSchema.index({ createdAt: -1 });

export default mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);