import { Router } from 'express';
import {
	getDashboardCategories,
	getDashboardSummary,
	getDashboardTrends
} from '../controllers/dashboardController.js';
import { protect } from '../middleware/auth.js';
import { roleGuard } from '../middleware/roleGuard.js';

const router = Router();

router.get('/', protect, roleGuard('viewer', 'analyst', 'admin'), getDashboardSummary);
router.get('/categories', protect, roleGuard('viewer', 'analyst', 'admin'), getDashboardCategories);
router.get('/trends', protect, roleGuard('viewer', 'analyst', 'admin'), getDashboardTrends);

export default router;