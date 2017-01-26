import _ from 'lodash/fp';
import { remove as removeDiacritics } from 'diacritics';

const transform = _.transform.convert({ 'cap': false });

export const splitLastCamelCased = _.curry((separator, str) =>
  _.camelCase(_.last(_.split(separator)(str))));

export const mapIfArray = (fn, value) => {
  return _.isArray(value)
    ? _.map(fn)(value)
    : fn(value);
};

export const applyFnIfObject = _.curry((fn, value) => {
  return _.isObject(value) ? fn(value) : value;
});

export const omitByRegex = _.curry((regex, obj) =>
  _.omitBy((val, key) => key.match(regex))(obj));

/**
 * Use this function if an array property has an structure like this { items: [{ item: { id: 1 }}, { item: { id: 1 }}]}
 * and you like to end up having the next structure { items: [{ id: 1}, { id: 2 }]}
 *
 * TODO:
 * - pass in the key prop for fetching the right value
 * - accept an array of paths
 */
export const flattenObjectsInArray = _.curry((path, fn, obj) => {
  const items = _.head(_.at(path, obj));

  if (!_.isArray(items)) {
    throw new Error('The path provided does not return an Array');
  }

  return _.reduce((memo, item) => (
    _.set(`${path}[${_.indexOf(item, items)}]`, fn(item))(memo)
  ), obj)(items);
});

/**
 * Apply passed fn tranforming the current key
 */
export const changeKeysDeep = _.curry((fn, obj) =>
  transform((result, value, key) =>
      (result[fn(key)] = mapIfArray(applyFnIfObject(changeKeysDeep(fn)), value))
    , {})(obj));

/**
 * Change key names by a provided object { 'currentKey': 'newKey' }
 */
export const replaceKeysDeep = _.curry((keysMap, obj) =>
  transform((result, value, key) =>
    (result[keysMap[key] || key] = mapIfArray(
      applyFnIfObject(replaceKeysDeep(keysMap)), value
    ))
    , {})(obj));

/**
 * Replaces the values matched from the attrList with the returned value from the provided function.
 * If the attribute is a path then the firt position will be used: 'attr1.attr2' => 'attr1'.
 */
export const replaceAttrValues = _.curry((fn, attrList, obj) =>
  _.mapValues((value) =>
      _.reduce((memo, attr) => {
        const attrValue = _.get(attr, memo);
        const result = attrValue
          ? _.set(_.head(_.split('.', attr)), fn(attrValue, attr), memo)
          : memo;
        return result;
      }, value, attrList),
    obj));

/**
 * Check if the item is not an array then it returns the item wrapped in an array.
 */
export const wrapInArray = (itemValue, itemPath, obj) => {
  return _.isArray(itemValue)
    ? obj
    : _.set(itemPath, [itemValue], obj);
};

export const arrayToObject = (array) =>
  _.keyBy((item) => _.indexOf(item, array), array);

/**
 * Sorting items by property
 * The property must be a string
 */
export const sortByWithoutDiacritics = _.curry((propKey, items) =>
  _.sortBy((item) => removeDiacritics(item[propKey]), _.values(items))
);

/**
 * Filtering by property without diacritincs
 * The property must be a string
 */
export const filterByWithoutDiacritics = _.curry((propKey, word, items) => {
  if (!word) {
    return items;
  }
  return _.filter(
    (item) =>
      _.startsWith(
        removeDiacritics(word.toLowerCase()),
        removeDiacritics(item[propKey].toLowerCase())
      ),
    items
  );
});

/**
 * pagerItems
 */
export const pagerItems = _.curry((page, inc, items) =>
  _.slice(
    page ? page * inc : 0,
    page * inc + inc,
    items)
);

/**
 * Returns a new array with uniq values from the specified property
 */
export const uniqMapByProp = _.curry((propKey, items) =>
  _.map(_.get(propKey), _.uniqBy(propKey, items))
);
