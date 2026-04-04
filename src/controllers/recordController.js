import { recordCreateSchema, recordQuerySchema } from '../schemas/recordSchema.js';
import {
  createRecordService,
  deleteRecordService,
  getRecordByIdService,
  getRecordsService,
  updateRecordService
} from '../services/recordService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/appError.js';
import { getPagination, getPaginationMeta } from '../utils/pagination.js';

export const createRecord = asyncHandler(async (req, res) => {
  const parsed = recordCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError('Validation failed', 400);
  }

  const record = await createRecordService(parsed.data);

  return res.status(201).json({ message: 'Record created', record });
});

export const getRecords = asyncHandler(async (req, res) => {
  const parsed = recordQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    throw new AppError('Validation failed', 400);
  }

  const { page, limit, ...filters } = parsed.data;
  const pagination = getPagination(page, limit);

  const { data, totalRecords } = await getRecordsService({
    ...filters,
    skip: pagination.skip,
    limit: pagination.limit
  });

  return res.json({
    data,
    ...getPaginationMeta({
      page: pagination.page,
      limit: pagination.limit,
      totalRecords
    })
  });
});

export const getRecordById = asyncHandler(async (req, res) => {
  const record = await getRecordByIdService(req.params.id);

  return res.json({ record });
});

export const updateRecord = asyncHandler(async (req, res) => {
  const parsed = recordCreateSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    throw new AppError('Validation failed', 400);
  }

  const record = await updateRecordService(req.params.id, parsed.data);

  return res.json({ message: 'Record updated', record });
});

export const deleteRecord = asyncHandler(async (req, res) => {
  await deleteRecordService(req.params.id);

  return res.json({ message: 'Record deleted' });
});