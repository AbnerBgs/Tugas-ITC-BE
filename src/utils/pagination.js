const getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.max(1, parseInt(query.limit, 10) || 10);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const formatPaginatedData = (data, totalItems, page, limit) => {
  const totalPages = Math.ceil(totalItems / limit);

  return {
    items: data,
    meta: {
      totalItems,
      totalPages,
      currentPage: page,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

module.exports = { getPagination, formatPaginatedData };