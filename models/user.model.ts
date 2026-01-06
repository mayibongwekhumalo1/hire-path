import mongoose, { Schema, Document } from 'mongoose';
import { User, UserRole } from '@/types';

export interface IUser extends Omit<User, 'id'>, Document {
  _id: mongoose.Types.ObjectId;
  id: string;
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['USER', 'DEPARTMENT', 'HR', 'ADMIN'],
    default: 'USER'
  },
  department: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for id
UserSchema.virtual('id').get(function(this: IUser) {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised
UserSchema.set('toJSON', {
  virtuals: true
});

// Index for better query performance
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });
UserSchema.index({ department: 1 });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);