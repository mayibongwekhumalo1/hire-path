import mongoose, { Schema, Document } from 'mongoose';

export interface IDepartment extends Document {
  _id: mongoose.Types.ObjectId;
  id: string;
  name: string;
  description?: string;
  manager?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DepartmentSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  manager: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for id
DepartmentSchema.virtual('id').get(function(this: IDepartment) {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised
DepartmentSchema.set('toJSON', {
  virtuals: true
});

// Index for better query performance
DepartmentSchema.index({ name: 1 }, { unique: true });

export default mongoose.models.Department || mongoose.model<IDepartment>('Department', DepartmentSchema);