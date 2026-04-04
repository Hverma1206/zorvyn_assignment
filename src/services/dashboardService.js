import { Record } from '../models/Record.js';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const getDashboardSummaryService = async () => {
  const [totals] = await Promise.all([
    Record.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' }
        }
      }
    ])
  ]);

  const summary = {
    income: 0,
    expense: 0
  };

  for (const item of totals) {
    if (item._id === 'income') {
      summary.income = item.total;
    }
    if (item._id === 'expense') {
      summary.expense = item.total;
    }
  }

  const [recentRecords, records] = await Promise.all([
    Record.find({ isDeleted: false }).sort({ date: -1, createdAt: -1 }).limit(5),
    Record.countDocuments({ isDeleted: false })
  ]);

  return {
    summary: {
      income: summary.income,
      expense: summary.expense,
      balance: summary.income - summary.expense,
      records
    },
    recentRecords
  };
};

export const getCategoryTotalsService = async () => {
  return Record.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: '$category',
        totalAmount: { $sum: '$amount' }
      }
    },
    {
      $project: {
        _id: 0,
        category: '$_id',
        totalAmount: 1
      }
    },
    { $sort: { totalAmount: -1 } }
  ]);
};

export const getMonthlyTrendsService = async () => {
  const trends = await Record.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' }
        },
        income: {
          $sum: {
            $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0]
          }
        },
        expense: {
          $sum: {
            $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0]
          }
        }
      }
    },
    {
      $sort: {
        '_id.year': 1,
        '_id.month': 1
      }
    },
    {
      $project: {
        _id: 0,
        month: {
          $arrayElemAt: [monthNames, { $subtract: ['$_id.month', 1] }]
        },
        income: 1,
        expense: 1
      }
    }
  ]);

  return trends;
};
