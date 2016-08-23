'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var smartSetter = function smartSetter(source) {
  return function (target) {
    if ((typeof source === 'undefined' ? 'undefined' : _typeof(source)) !== 'object') return source;
    return Object.keys(source).reduce(function (acc, key) {
      console.log('key', key);
      if (key === '_replace') {
        console.log('returning source');
        return source[key];
      } else {
        var nextSource = source[key];
        var nextTarget = target[key];
        acc[key] = smartSetter(nextSource)(nextTarget);
        console.log('not returning source', acc);
        return acc;
      }
    }, Object.assign({}, target));
  };
};

exports.default = smartSetter;