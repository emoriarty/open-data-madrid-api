import _ from 'lodash/fp';

const checkArguments = (url) => {
  if (!url) {
    throw new Error('No argument was passed in or is empty. Expected a url.');
  }

  if (!_.isString(url)) {
    throw new Error('The argument passed in is not a String.');
  }

  if (!url.match(/((http|https)\:\/\/)?[a-zA-Z0-9\.\/\?\:@\-_=#]+\.([a-zA-Z0-9\&\.\/\?\:@\-_=#])*/g)) {
    throw new Error('The argument passed in does not match an url format.');
  }
};

const dataFetcher = {
  fetch(url) {

    checkArguments(url);
    // TODO: check extension type and then apply parser
    return fetch(url)
      .then(
        (resp) => resp.text(),
        (err) => err
      );

    // DEBUG
    // return new Promise((resolve, reject) => {
    //   fs.readFile(path.resolve('data/206974-0-agenda-eventos-culturales-100.csv'), 'utf8',
    //     (err, contents) => {
    //       return err ? reject(err) : resolve(contents);
    //     });
    // })
    // .then((doc) => parseCSV(doc));
  },

  getConfig() {

    return 'config';
  }
};

export default dataFetcher;
