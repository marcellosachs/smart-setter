'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _whiteList = function _whiteList(config, target, list) {
  if (config.isArrayOrList(target)) {
    return target.filter(function (ele) {
      return list.includes(config.get(ele, 'name'));
    });
  } else if (config.isObjectOrMap(target)) {
    return list.reduce(function (acc, ele) {
      var value = config.get(target, ele);
      return config.set(acc, ele, value);
    }, config.emptyObjectOrMap());
  } else {
    return target;
  }
};

var _blackList = function _blackList(config, target, list) {
  var totalList = void 0;
  if (config.isArrayOrList(target)) {
    totalList = target.map(function (ele) {
      return config.get(ele, 'name');
    });
  } else if (config.isObjectOrMap(target)) {
    totalList = config.getKeys(target);
  } else {
    return target;
  }
  var whiteList = totalList.filter(function (ele) {
    return !list.includes(ele);
  });
  return _whiteList(config, target, whiteList);
};

var fillWhereTargetNotPresent = function fillWhereTargetNotPresent(config) {
  return function (source) {
    if (config.isArrayOrList(source)) {
      return source.map(fillWhereTargetNotPresent(config));
    } else if (!config.isObjectOrMap(source)) {
      return source;
    } else {
      var keys = config.getKeys(source);
      if (keys) {
        return keys.reduce(function (acc, key) {
          var value = config.get(source, key);
          if (key === '_replace') {
            return config.merge(acc, fillWhereTargetNotPresent(config)(value));
          } else {
            return config.set(acc, key, fillWhereTargetNotPresent(config)(value));
          }
        }, config.emptyObjectOrMap());
      } else {
        return source;
      }
    }
  };
};

var helper = function helper(config) {
  return function (source) {
    return function (target) {

      var list = void 0;

      if (!config.isObjectOrMap(source)) return source;
      if (target === null || target === undefined) return fillWhereTargetNotPresent(config)(source);
      return config.getKeys(source).reduce(function (acc, key) {
        var _ret = function () {

          switch (key) {
            case '_replace':
              return {
                v: config.get(source, key)
              };
              break;

            case '_apply':
              var fn = config.get(source, key);
              var y1 = fn(acc);
              return {
                v: y1
              };
              break;

            case '_insert':
              var newEle = config.get(source, key);
              var oldArr = acc;
              return {
                v: config.push(oldArr, newEle)
              };
              break;

            case '_remove':
              var properties = config.get(source, key);
              var newArray = acc.filter(function (ele) {
                return !config.getKeys(properties).reduce(function (acc, key2) {
                  return acc && config.get(properties, key2) === config.get(ele, key2);
                }, true);
              });
              return {
                v: newArray
              };
              break;

            case '_whiteList':
              list = config.get(source, key);
              return {
                v: _whiteList(config, acc, list)
              };

            case '_blackList':
              list = config.get(source, key);
              return {
                v: _blackList(config, acc, list)
              };

            default:
              if (config.isArrayOrList(acc)) {
                var _ret2 = function () {
                  var _key$split = key.split("=");

                  var _key$split2 = _slicedToArray(_key$split, 2);

                  var propKey = _key$split2[0];
                  var propValue = _key$split2[1];

                  return {
                    v: {
                      v: acc.map(function (ele) {
                        if (config.get(ele, propKey) == propValue) {
                          return helper(config)(config.get(source, key))(ele);
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
                var nextTarget = config.get(acc, key);
                var acc2 = config.set(acc, key, helper(config)(nextSource)(nextTarget));
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

var smartSetter = function smartSetter(config) {
  return function (source) {
    return function (target) {
      var source2 = config.toThisConfigsType(source);
      return helper(config)(source2)(target);
    };
  };
};

exports.default = smartSetter;