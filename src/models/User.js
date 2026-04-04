import mongoose from 'mongoose';

export const Role = {
  VIEWER: 'viewer',
  ANALYST: 'analyst',
  ADMIN: 'admin'
};

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: Object.values(Role), default: Role.VIEWER },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const User = mongoose.model('User', UserSchema);