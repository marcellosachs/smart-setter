'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var smartSetter = function smartSetter(config) {
  return function (source) {
    return function (target) {
      if (!config.isObject(source)) return source;
      return config.getKeys(source).reduce(function (acc, key) {
        var _ret = function () {
          switch (key) {
            case '_replace':
              return {
                v: config.get(source, key)
              };
              break;

            case '_insert':
              var newEle = config.get(source, key);
              var oldArr = target;
              return {
                v: config.push(oldArr, newEle)
              };
              break;

            case '_remove':
              var properties = config.get(source, key);
              var newArray = target.filter(function (ele) {
                return !config.getKeys(properties).reduce(function (acc, key2) {
                  return acc && config.get(properties, key2) === config.get(ele, key2);
                }, true);
              });
              return {
                v: newArray
              };
              break;

            default:
              if (config.isArrayOrList(target)) {
                var _ret2 = function () {
                  var _key$split = key.split("=");

                  var _key$split2 = _slicedToArray(_key$split, 2);

                  var propKey = _key$split2[0];
                  var propValue = _key$split2[1];

                  return {
                    v: {
                      v: target.map(function (ele) {
                        if (config.get(ele, propKey) == propValue) {
                          return smartSetter(config)(config.get(source, key))(ele);
                        } else {
                          return ele;
                        }
                      })
                    }
                  };
                }();

                if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
              } else {
                var nextSource = config.get(source, key);
                var nextTarget = config.get(target, key);
                var acc2 = config.set(acc, key, smartSetter(config)(nextSource)(nextTarget));
                return {
                  v: acc2
                };
              }
              break;
          }
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
      }, config.clone(target));
    };
  };
};

exports.default = smartSetter;