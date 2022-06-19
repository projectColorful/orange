/* eslint-disable no-param-reassign */
const multer = require('multer');
const mime = require('mime-types');
const crypto = require('crypto');
const _ = require('lodash');
const config = require('../lib/config');

// 파일을 저장할 위치 결정
function getDestination(path, pathMatch, file) {
  // []로 끝나는 배열데이터는 []앞의 문자열을 키로 사용
  const fieldname = file.fieldname.endsWith('[]') ? file.fieldname.replace(/\[\]$/, '') : file.fieldname;

  // 필드명과 매칭되는 경로가 있으면 따로 매칭
  let filePath = path;
  if (!_.isEmpty(pathMatch) && pathMatch[fieldname]) {
    filePath = pathMatch[fieldname];
  }

  return `${config.app.storagePath}/${filePath}`;
}

const handleFile = ({
  path = '',
  pathMatch = {},
  fileSize = 1024 * 1024 * 1024,
  extentions = [
    'jar',
    'rar',
    'html',
    'exe',
    'swf',
    'xap',
    'phtml',
    'shtml',
    'xml',
  ],
} = {}) => {
  const storage = multer.diskStorage({
    // 경로 설정
    destination: (_req, file, cb) => {
      cb(null, getDestination(path, pathMatch, file));
    },

    // 실제 저장되는 파일명 설정
    filename: (_req, file, cb) => {
      file.originalname = String(file.originalname).trim(); // 앞뒤공백 제거

      const extension = {
        'application/haansoftdocx': 'docx',
        'application/haansofthwp': 'hwp',
        'application/haansoftxlsx': 'xlsx',
        'application/pdf': 'pdf',
        'application/x-zip-compressed': 'zip',
        pdf: 'pdf',
        xlsx: 'xlsx',
      }[file.mimetype] || file.originalname.split('.').pop() || mime.extension(file.mimetype);

      if (!extension) {
        cb(new Error(`Unexpected mime-type: ${file.mimetype}`), null);
        return;
      }

      // 확장자 필터 있으면 체크 (extension에 포함된 확장자는 거부)
      if (extentions.length > 0 && extentions.includes(extension)) {
        cb(new Error(`Disallowed mime-type: ${file.mimetype}`), null);
        return;
      }

      // sha256 설정, hex 베이스
      const timeInMs = Date.now();
      const hash = crypto
        .createHash('sha256')
        .update(file.originalname + crypto.randomBytes(8).toString('hex') + timeInMs)
        .digest('hex');
      const filename = `${hash}_${timeInMs}.${extension}`;

      cb(null, filename);
    },
  });

  const upload = multer({
    storage,
    limits: {
      fileSize,
    },
  }).any();

  return upload;
};

const sanitizeArrayFields = (req, res, next) => {
  // []로 끝나는 배열데이터에서 빈 배열을 표현하기 위해 빈문자열 값만 제거

  // eslint-disable-next-line no-restricted-syntax
  for (const prop in req.body) {
    if (Array.isArray(req.body[prop])) {
      req.body[prop] = req.body[prop].filter((x) => x !== '');
    }
  }

  next();
};

const setFileFields = (req, res, next) => {
  req.files = req.files || [];
  req.files.forEach((file) => {
    // []로 끝나는 배열데이터는 []앞의 문자열을 키로 사용해서 배열에 합쳐서 넣음
    const fieldname = file.fieldname.endsWith('[]') ? file.fieldname.replace(/\[\]$/, '') : file.fieldname;

    // 같은 키를 가진 데이터가 있으면 배열데이터인지 여부 상관없이 배열에 합쳐서 넣음
    if (Array.isArray(req.body[fieldname])) {
      req.body[fieldname].push(file);
    } else {
      req.body[fieldname] = req.body[fieldname] ? [req.body[fieldname], file] : file;
    }
  });
  req.files = [];

  next();
};

module.exports = (options) => [handleFile(options), sanitizeArrayFields, setFileFields];
