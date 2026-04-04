import {
  getCategoryTotalsService,
  getDashboardSummaryService,
  getMonthlyTrendsService
} from '../services/dashboardService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getDashboardSummary = asyncHandler(async (req, res) => {
  const data = await getDashboardSummaryService();
  return res.json(data);
});

export const getDashboardCategories = asyncHandler(async (req, res) => {
  const data = await getCategoryTotalsService();
  return res.json(data);
});

export const getDashboardTrends = asyncHandler(async (req, res) => {
  const data = await getMonthlyTrendsService();
  return res.json(data);
});