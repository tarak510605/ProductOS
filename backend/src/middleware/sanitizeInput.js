const sanitizeHtml = require('sanitize-html');

const sanitizeValue = (value) => {
  if (typeof value === 'string') {
    return sanitizeHtml(value, {
      allowedTags: [],
      allowedAttributes: {}
    }).trim();
  }

  if (Array.isArray(value)) {
    return value.map((entry) => sanitizeValue(entry));
  }

  if (value && typeof value === 'object') {
    return Object.keys(value).reduce((accumulator, key) => {
      if (key.startsWith('$') || key.includes('.')) {
        return accumulator;
      }

      accumulator[key] = sanitizeValue(value[key]);
      return accumulator;
    }, {});
  }

  return value;
};

const sanitizeInput = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    Object.keys(req.body).forEach((key) => {
      req.body[key] = sanitizeValue(req.body[key]);
    });
  }

  if (req.query && typeof req.query === 'object') {
    Object.keys(req.query).forEach((key) => {
      req.query[key] = sanitizeValue(req.query[key]);
    });
  }

  if (req.params && typeof req.params === 'object') {
    Object.keys(req.params).forEach((key) => {
      req.params[key] = sanitizeValue(req.params[key]);
    });
  }

  next();
};

module.exports = sanitizeInput;
