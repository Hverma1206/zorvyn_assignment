export const getPagination = (page, limit) => {
  const safePage = Number.isFinite(page) ? Math.max(page, 1) : 1;
  const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 100) : 10;
  const skip = (safePage - 1) * safeLimit;

  return {
    page: safePage,
    limit: safeLimit,
    skip
  };
};

export const getPaginationMeta = ({ page, limit, totalRecords }) => {
  return {
    page,
    totalPages: Math.ceil(totalRecords / limit) || 1,
    totalRecords
  };
};
