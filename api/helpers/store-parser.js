import _ from 'lodash/fp';
import { normalize, schema } from 'normalizr';
import {
  arrayToObject,
  replaceAttrValues
} from './utils';

const itemsSchema = new schema.Entity('items', {});
const catalogsSchema = new schema.Entity('catalogs', {
  'items': [itemsSchema]
}, {
  processStrategy: (entity, parent, key) => {
    let tmpEntity = _.set('id', _.last(_.split('/', entity.id)), entity);
    tmpEntity = _.set(
      'items',
      _.map((item) => _.set('id', _.last(_.split('/', item.id)), item), tmpEntity.items),
      tmpEntity);
    return tmpEntity;
  }
});
const attrListValue = ['title', 'description','issued', 'modified', 'url'];
const attrListResource = ['homepage', 'license', 'themeTaxonomy', 'publisher', 'theme'];
const attrListLabel = ['periodicity.frequency'];
const attrList = _.flatten(_.concat(attrListValue, [attrListResource, attrListLabel]));

const execAttr = (obj, attr) => {
  if (!obj) {
    return;
  }

  return _.includes(attr, attrListValue)
    ? obj.value
    : _.includes(attr, attrListResource)
      ? obj.resource
      : _.includes(attr, attrListLabel)
        ? obj.label
        : null;
};

const parseCatalogs = (store) =>
  _.set(
    'entities.catalogs',
    replaceAttrValues(execAttr, attrList, store.entities.catalogs),
    store);

const parseItems = (store) =>
  _.set(
    'entities.items',
    replaceAttrValues(execAttr, attrList, store.entities.items),
    store);

const parseFormats = (store) =>
    _.set(
      'entities.items',
      _.mapValues(
        (item) => {
          let formats = _.values(replaceAttrValues(execAttr, attrList, arrayToObject(item.formats)));
          formats = _.values(replaceAttrValues((val) => val.toString(), ['title'], formats));
          return _.set('formats', formats, item);
        },
        store.entities.items),
      store);

const parse = (store) =>
  parseFormats(parseItems(parseCatalogs(store)));

const storeParser = {
  normalize: (obj) => normalize(obj, [catalogsSchema]),
  parse,
  parseCatalogs,
  parseItems,
  parseFormats
};

export default storeParser;
