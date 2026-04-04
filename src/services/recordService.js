import { Record } from '../models/Record.js';
import { AppError } from '../utils/appError.js';

export const createRecordService = async (payload) => {
  return Record.create({
    ...payload,
    date: payload.date ? new Date(payload.date) : undefined
  });
};

export const getRecordsService = async ({ type, category, search, startDate, endDate, skip, limit }) => {
  const query = { isDeleted: false };

  if (type) {
    query.type = type;
  }
  if (category) {
    query.category = category;
  }
  if (search) {
    query.$or = [
      { category: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  if (startDate || endDate) {
    query.date = {};
    if (startDate) {
      query.date.$gte = new Date(startDate);
    }
    if (endDate) {
      query.date.$lte = new Date(endDate);
    }
  }

  const [data, totalRecords] = await Promise.all([
    Record.find(query)
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Record.countDocuments(query)
  ]);

  return { data, totalRecords };
};

export const getRecordByIdService = async (recordId) => {
  const record = await Record.findOne({ _id: recordId, isDeleted: false });
  if (!record) {
    throw new AppError('Record not found', 404);
  }

  return record;
};

export const updateRecordService = async (recordId, payload) => {
  const nextPayload = { ...payload };
  if (nextPayload.date) {
    nextPayload.date = new Date(nextPayload.date);
  }

  const record = await Record.findOneAndUpdate(
    { _id: recordId, isDeleted: false },
    nextPayload,
    { new: true, runValidators: true }
  );

  if (!record) {
    throw new AppError('Record not found', 404);
  }

  return record;
};

export const deleteRecordService = async (recordId) => {
  const record = await Record.findOneAndUpdate(
    { _id: recordId, isDeleted: false },
    { isDeleted: true, deletedAt: new Date() },
    { new: true }
  );

  if (!record) {
    throw new AppError('Record not found', 404);
  }
};
