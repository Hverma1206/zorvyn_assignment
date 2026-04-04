import { Router } from 'express';
import {
  createRecord,
  deleteRecord,
  getRecordById,
  getRecords,
  updateRecord
} from '../controllers/recordController.js';
import { protect } from '../middleware/auth.js';
import { roleGuard } from '../middleware/roleGuard.js';

const router = Router();

router.get('/', protect, roleGuard('analyst', 'admin'), getRecords);
router.get('/:id', protect, roleGuard('analyst', 'admin'), getRecordById);
router.post('/', protect, roleGuard('admin'), createRecord);
router.put('/:id', protect, roleGuard('admin'), updateRecord);
router.delete('/:id', protect, roleGuard('admin'), deleteRecord);

export default router;