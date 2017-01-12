import values from 'lodash/fp/values';
import keys from 'lodash/fp/keys';

const getCatalogItems = (req, res, next) => {
  const { data: { items } } = req.app.locals;
  res.json(values(items));
};

module.exports = {
  GetCatalogItems: getCatalogItems
};
