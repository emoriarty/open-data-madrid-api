const getDefaultCatalog = (req, res, next) => {
  const { data: { catalog } } = req.app.locals;
  res.json(catalog);
};

module.exports = {
  GetDefaultCatalog: getDefaultCatalog
};
