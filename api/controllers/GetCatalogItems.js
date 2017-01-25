import eq from 'lodash/fp/eq';
import last from 'lodash/fp/last';
import flow from 'lodash/fp/flow';
import {
  filterByWithoutDiacritics,
  pagerItems,
  sortByWithoutDiacritics
} from '../helpers/utils';


const getCatalogItems = (req, res, next) => {

  const { data } = req.app.locals;
  const { params: { page, search } } = req.swagger;
  const manageItems = flow(
    sortByWithoutDiacritics('title'),
    filterByWithoutDiacritics('title', search.value)
  );
  const items = manageItems(data.items);
  const result = pagerItems(page.value, 25, items);

  res.json({
    more: !eq(last(result), last(items)),
    items: result
  });
};

module.exports = {
  GetCatalogItems: getCatalogItems
};
