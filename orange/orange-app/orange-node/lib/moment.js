const moment = require('moment');
require('moment/locale/ko');
const { extendMoment } = require('moment-range');

module.exports = extendMoment(moment);
