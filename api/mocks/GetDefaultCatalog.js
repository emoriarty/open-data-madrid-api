const getDefaultCatalog = (req, res, next) =>
  res.json({
    id: 'defaultCatalog',
    title: 'Default mocked catalog',
    description: 'Default description',
    language: 'es',
    issued: '2014-03-12T09:00:00.000Z',
    modified: '2016-12-20T00:00:00.000Z',
    items: [
      'catalog-item-1',
      'catalog-item-2'
    ]
  });

module.exports = {
  GetDefaultCatalog: getDefaultCatalog
};
