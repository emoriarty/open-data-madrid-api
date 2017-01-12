const getCatalogItem = (req, res, next) => {
  const { data: { items } } = req.app.locals;
  res.json(items[req.swagger.params.id.value]);
};

module.exports = {
  GetCatalogItem: getCatalogItem
};
