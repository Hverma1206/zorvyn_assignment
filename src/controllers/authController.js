import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Role } from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { loginSchema, userCreateSchema } from '../schemas/userSchema.js';

export const register = async (req, res) => {
  const parsed = userCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: parsed.error.flatten()
    });
  }

  const { username, email, password } = parsed.data;

  const existingUser = await User.findOne({
    $or: [{ username }, { email }]
  });

  if (existingUser) {
    return res.status(409).json({ success: false, message: 'Username or email already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    role: Role.VIEWER
  });

  const token = generateToken(user._id, user.role);

  return res.status(201).json({
    message: 'User registered successfully',
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    }
  });
};

export const login = async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: parsed.error.flatten()
    });
  }

  const { username, password } = parsed.data;
  const user = await User.findOne({ username });

  if (!user || !user.isActive) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const token = generateToken(user._id, user.role);

  return res.json({
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    }
  });
};

export const getProfile = async (req, res) => {
  return res.json({
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
      isActive: req.user.isActive
    }
  });
};