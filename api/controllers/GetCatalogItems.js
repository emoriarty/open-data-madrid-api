import values from 'lodash/fp/values';
import sortBy from 'lodash/fp/sortBy';
import slice from 'lodash/fp/slice';
import eq from 'lodash/fp/eq';
import last from 'lodash/fp/last';

const getCatalogItems = (req, res, next) => {
  const { data } = req.app.locals;
  const { params: { page } } = req.swagger;
  const items = sortBy(['title'], values(data.items));
  const result = slice(
    page.value ? page.value * 25 : 0,
    page.value * 25 + 25,
    items);

  res.json({
    more: !eq(last(result), last(items)),
    items: result
  });
};

module.exports = {
  GetCatalogItems: getCatalogItems
};
