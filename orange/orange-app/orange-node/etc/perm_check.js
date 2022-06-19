function allow(key, values) {
  return (req, res, next) => {
    if (values.map((x) => String(x)).includes(String(req.user[key]))) {
      return next();
    }

    return res.status(403).end();
  };
}

function deny(key, values) {
  return (req, res, next) => {
    if (!values.map((x) => String(x)).includes(String(req.user[key]))) {
      return next();
    }

    return res.status(403).end();
  };
}

module.exports.allow = allow;
module.exports.deny = deny;
