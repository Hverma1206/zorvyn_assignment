import { Router } from 'express';
import {
  createUser,
  getUsers,
  updateUserRole,
  updateUserStatus
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { roleGuard } from '../middleware/roleGuard.js';

const router = Router();

router.use(protect, roleGuard('admin'));

router.post('/', createUser);
router.get('/', getUsers);
router.patch('/:id/role', updateUserRole);
router.patch('/:id/status', updateUserStatus);

export default router;
