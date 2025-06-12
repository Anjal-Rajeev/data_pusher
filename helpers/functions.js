
export const paginationValues = ({ page, limit }) => {
  if (isNull(page) || page < 1) page = 1;
  else page = Number(page);

  if (isNull(limit) || limit < 1) limit = 20;
  else limit = Number(limit);

  const skip = (page - 1) * limit;
  return { page, limit, skip };
};