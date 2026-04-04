import mongoose from 'mongoose';

export const RecordType = {
  INCOME: 'income',
  EXPENSE: 'expense'
};

const RecordSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  type: { type: String, enum: Object.values(RecordType), required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
  description: { type: String },
  isDeleted: { type: Boolean, default: false, index: true },
  deletedAt: { type: Date, default: null }
}, { timestamps: true });

export const Record = mongoose.model('Record', RecordSchema);