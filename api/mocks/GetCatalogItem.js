const getCatalogItem = (req, res, next) =>
  res.json({
    id: 'catalogItem1',
    title: 'Mocked catalog item 1',
    description: 'Default description',
    language: 'es',
    issued: '2014-03-12T09:00:00.000Z',
    modified: '2016-12-20T00:00:00.000Z',
    periodicity: 'mensual',
    formats: [
      {
        title: 'format title 1',
        url: 'formatUrl1',
        mediaType: 'text/csv',
        size: 2920448
      }
    ]
  });

module.exports = {
  GetCatalogItem: getCatalogItem
};
