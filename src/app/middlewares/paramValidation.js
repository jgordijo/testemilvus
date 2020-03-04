export default async (req, res, next) => {
  const { limit, page } = req.query;

  if (
    (limit === null || limit === undefined) &&
    (page === null || page === undefined)
  ) {
    return next();
  }

  if (Number.isNaN(limit) || Number.isNaN(page)) {
    return res.status(400).json({ error: 'Dados de paginação inválidos' });
  }

  return next();
};
