import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { AppError } from '../utils/appError.js';

export const createUserService = async ({ username, email, password, role, isActive }) => {
  const existingUser = await User.findOne({
    $or: [{ username }, { email }]
  });

  if (existingUser) {
    throw new AppError('Username or email already exists', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    role,
    isActive
  });

  return {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    isActive: user.isActive
  };
};

export const listUsersService = async ({ role, isActive, search, skip, limit }) => {
  const query = {};

  if (role) {
    query.role = role;
  }
  if (isActive !== undefined) {
    query.isActive = isActive;
  }
  if (search) {
    query.$or = [
      { username: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  const [users, totalRecords] = await Promise.all([
    User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments(query)
  ]);

  return {
    data: users,
    totalRecords
  };
};

export const updateUserRoleService = async (userId, role) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

export const updateUserStatusService = async ({ userId, isActive, actorUserId }) => {
  if (String(userId) === String(actorUserId) && isActive === false) {
    throw new AppError('You cannot deactivate your own account', 400);
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { isActive },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};
