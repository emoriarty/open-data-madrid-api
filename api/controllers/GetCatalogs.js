import values from 'lodash/fp/values';

const getCatalogs = (req, res) => {
  const { data: { catalogs } } = req.app.locals;
  res.json(values(catalogs));
};

module.exports = {
  GetCatalogs: getCatalogs
};
