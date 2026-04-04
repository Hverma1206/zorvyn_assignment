import { z } from 'zod';

export const userCreateSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['viewer', 'analyst', 'admin']).optional().default('viewer')
});

export const loginSchema = z.object({
  username: z.string(),
  password: z.string()
});

export const adminUserCreateSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['viewer', 'analyst', 'admin']).optional().default('viewer'),
  isActive: z.boolean().optional().default(true)
});

export const userUpdateSchema = z.object({
  role: z.enum(['viewer', 'analyst', 'admin']).optional(),
  isActive: z.boolean().optional()
}).refine((payload) => payload.role !== undefined || payload.isActive !== undefined, {
  message: 'At least one field (role or isActive) is required'
});

export const userListQuerySchema = z.object({
  role: z.enum(['viewer', 'analyst', 'admin']).optional(),
  isActive: z.preprocess((value) => {
    if (value === 'true') {
      return true;
    }
    if (value === 'false') {
      return false;
    }
    return value;
  }, z.boolean().optional()),
  search: z.string().min(1).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10)
});

export const userRoleUpdateSchema = z.object({
  role: z.enum(['viewer', 'analyst', 'admin'])
});

export const userStatusUpdateSchema = z.object({
  isActive: z.boolean()
});