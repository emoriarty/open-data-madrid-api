import _ from 'lodash/fp';
import { Parser } from 'xml2js';
import {
  changeKeysDeep,
  flattenObjectsInArray,
  omitByRegex,
  replaceKeysDeep,
  splitLastCamelCased,
  wrapInArray
} from './utils';

const flattenPaths = (parsedXml, flattenRules) => {
  let result = parsedXml;

  _.each((flattenOpt) => {
    if (_.includes('.[].', flattenOpt.path)) {
      // It's an array
      const path = _.split('.[].', flattenOpt.path);
      const parentPath = _.head(path);
      // Run through evary item for flatten objects
      const tmpResult = _.map((item) => {
        const itemValue = _.head(_.at(_.last(path), item));
        const itemPath = _.last(path); // path to flatten
        return itemValue
          ? flattenObjectsInArray(itemPath, flattenOpt.fn)(
              wrapInArray(itemValue, itemPath, item)
            )
          : item;
      }, _.get(parentPath, result));
      // Storing new formed array into the same parent path
      result = _.set(parentPath, tmpResult, result);
    } else {
      result = flattenObjectsInArray(flattenOpt.path, flattenOpt.fn)(result);
    }
  }, flattenRules);

  return result;
};

const xmlParser = {
  async parse(xml, options) {

    const parser = new Parser({
      attrkey: 'attrs',
      charkey: 'value',
      explicitArray: false,
      explicitRoot: false,
      mergeAttrs: true,
      valueProcessors: [
        (value) => { // fix date format
          return value.match(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d/)
            ? new Date(value).toISOString()
            : value;
        },
        (value) => { // string numbers to numbers
          if (_.isString(value)) {
            const result = value.match(/^\d+$/g);
            if (_.isArray(result) && result.length === 1) {
              return parseInt(value);
            }
          }
          return value;
        }
      ]
    });

    return await new Promise((resolve, reject) => {
      parser.parseString(xml, (err, result) => {
        if (err) {
          reject(err);
        }

        try {
          const parsedXml = flattenPaths(changeKeysDeep(splitLastCamelCased(':'))(
              replaceKeysDeep(options.keysMap)(
                omitByRegex(/^xmlns:*/)(result)
              )
          ), options.flattenPath);

          resolve(parsedXml);
        }
        catch (err) {
          console.error(err);
          reject(err);
        }
      });
    });
  }
};

export default xmlParser;
