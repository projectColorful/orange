const isEmpty = (...values) => {
  for (const value of values) {
    if (typeof value === 'number' && value === 0) continue;
    if (
      value == 'null'
      || value == ''
      || value == null
      || value == undefined
      || value === 'undefined'
      || (value != null && typeof value === 'object' && !Object.keys(value).length)
    ) {

      return true;
    }
  }
  return false;
};

module.exports = isEmpty;
