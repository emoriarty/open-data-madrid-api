import values from 'lodash/fp/values';
import sortBy from 'lodash/fp/sortBy';
import slice from 'lodash/fp/slice';
import eq from 'lodash/fp/eq';
import last from 'lodash/fp/last';
import filter from 'lodash/fp/filter';
import startsWith from 'lodash/fp/startsWith';

const filterItems = (word, items) => {
  if (!word) {
    return items;
  }
  return filter((item) => 
    startsWith(word.toLowerCase(), item.title.toLowerCase()), items);
};

const getCatalogItems = (req, res, next) => {
  const { data } = req.app.locals;
  const { params: { page, search } } = req.swagger;
  let items = [];
  items = sortBy(['title'], values(data.items));
  items = filterItems(search.value, items);
  const result = slice(
    page.value ? page.value * 25 : 0,
    page.value * 25 + 25,
    items);

  console.log(search.value, page.value, result.length);

  res.json({
    more: !eq(last(result), last(items)),
    items: result
  });
};

module.exports = {
  GetCatalogItems: getCatalogItems
};
