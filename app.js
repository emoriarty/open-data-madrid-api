require('isomorphic-fetch');
const SwaggerExpress = require('swagger-express-mw');
const app = require('express')();
const Cors = require('cors');
import dataFetcher from './api/helpers/data-fetcher';
import xmlParser from './api/helpers/xml-parser';
import storeParser from './api/helpers/store-parser';
import Rx from 'rx';

module.exports = app; // for testing

const catalogUrl = 'http://datos.madrid.es/egob/catalogo.rdf';
const config = {
  appRoot: __dirname // required config
};
const keysMap = {
  'dct:identifier': 'id',
  'dcat:dataset': 'items',
  'dcat:Dataset': 'item',
  'dcat:distribution': 'formats',
  'dcat:Distribution': 'format',
  'dct:accrualPeriodicity': 'periodicity',
  'dcat:accessURL': 'url',
  'dcat:byteSize': 'size'
};
const catalogParserOptions = {
  keysMap,
  flattenPath: [
    { path: 'catalog.items', fn: (obj) => obj.item },
    { path: 'catalog.items.[].formats', fn: (obj) => obj.format }
  ]
};

// Observables
const intervalRequestStream = Rx.Observable
  .interval(3600000)
  .startWith(0)
  .flatMap(
    () => Rx.Observable.fromPromise(dataFetcher.fetch(catalogUrl))
  );
// const catalogRequestStream = Rx.Observable.fromPromise(
//    dataFetcher.fetch(catalogUrl));

// Observers
const catalogRequestStreamOnNext = (data) => {
  Rx.Observable.fromPromise(xmlParser.parse(data, catalogParserOptions))
    .subscribe(
      catalogParseOnNext,
      (error) => console.error('Error parsing catalog', error),
      () => console.log('Catalog parse completed')
    );
};

const catalogParseOnNext = (data) => {
  const normalizedData = storeParser.normalize(data);
  const parsedData = storeParser.parse(normalizedData);

  app.locals.data = {
    catalog: parsedData.entities.catalogs['http://datos.madrid.es/egob/catalogo'],
    catalogs: parsedData.entities.catalogs,
    items: parsedData.entities.items
  };
};

// Subscriptions
intervalRequestStream
  .subscribe(
    catalogRequestStreamOnNext,
    (error) => console.error('Error fetching catalog', error),
    () => console.log('Catalog fetch completed')
  );

// Main
SwaggerExpress.create(config, (err, swaggerExpress) => {
  if (err) {
    throw err;
  }

  // install middleware
  app.use(Cors());

  swaggerExpress.register(app);
  const port = process.env.PORT || 10010;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port);
  }
});
