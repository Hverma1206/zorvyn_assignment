import {
  adminUserCreateSchema,
  userListQuerySchema,
  userRoleUpdateSchema,
  userStatusUpdateSchema
} from '../schemas/userSchema.js';
import {
  createUserService,
  listUsersService,
  updateUserRoleService,
  updateUserStatusService
} from '../services/userService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/appError.js';
import { getPagination, getPaginationMeta } from '../utils/pagination.js';

export const createUser = asyncHandler(async (req, res) => {
  const parsed = adminUserCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError('Validation failed', 400);
  }

  const user = await createUserService(parsed.data);

  return res.status(201).json({
    message: 'User created successfully',
    user
  });
});

export const getUsers = asyncHandler(async (req, res) => {
  const parsed = userListQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    throw new AppError('Validation failed', 400);
  }

  const { page, limit, ...filters } = parsed.data;
  const pagination = getPagination(page, limit);
  const { data, totalRecords } = await listUsersService({
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

export const updateUserRole = asyncHandler(async (req, res) => {
  const parsed = userRoleUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError('Validation failed', 400);
  }

  const user = await updateUserRoleService(req.params.id, parsed.data.role);

  return res.json({
    message: 'User role updated successfully',
    user
  });
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const parsed = userStatusUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError('Validation failed', 400);
  }

  const user = await updateUserStatusService({
    userId: req.params.id,
    isActive: parsed.data.isActive,
    actorUserId: req.user._id
  });

  return res.json({
    message: 'User status updated successfully',
    user
  });
});
