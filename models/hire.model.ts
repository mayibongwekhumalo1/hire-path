import mongoose, { Schema, Document } from 'mongoose';
import { Hire, EmploymentType, WorkLocation, HireStatus } from '@/types/hire.types';

export interface IHire extends Omit<Hire, '_id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const HireSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  personalEmail: {
    type: String,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  jobTitle: {
    type: String,
    required: true,
    trim: true
  },
  employmentType: {
    type: String,
    enum: ['FULL_TIME', 'PART_TIME', 'CONTRACTOR', 'INTERN'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  workLocation: {
    type: String,
    enum: ['OFFICE', 'REMOTE', 'HYBRID'],
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING'
  },
  notes: {
    type: String,
    trim: true
  },
  managerName: {
    type: String,
    trim: true
  },
  managerEmail: {
    type: String,
    lowercase: true,
    trim: true
  },
  hasBackgroundCheck: {
    type: Boolean,
    default: false
  },
  backgroundCheckDate: {
    type: Date
  },
  hasSignedNDA: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for id
HireSchema.virtual('id').get(function(this: IHire) {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised
HireSchema.set('toJSON', {
  virtuals: true
});

// Index for better query performance
HireSchema.index({ email: 1 });
HireSchema.index({ department: 1 });
HireSchema.index({ status: 1 });
HireSchema.index({ startDate: 1 });
HireSchema.index({ createdAt: -1 });

export default mongoose.models.Hire || mongoose.model<IHire>('Hire', HireSchema);