'use strict';

var _chai = require('chai');

var _index = require('../../index');

var _index2 = _interopRequireDefault(_index);

var _objectConfigForSmartSetter = require('object-config-for-smart-setter');

var _objectConfigForSmartSetter2 = _interopRequireDefault(_objectConfigForSmartSetter);

var _immutableConfigForSmartSetter = require('immutable-config-for-smart-setter');

var _immutableConfigForSmartSetter2 = _interopRequireDefault(_immutableConfigForSmartSetter);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// var _immutable2 = Immutable
// const immutableConfigForSmartSetter = {
//   get: function get($$obj, propKey) {
//     return $$obj.get(propKey);
//   },
//   set: function set($$obj, propKey, value) {
//     return $$obj.set(propKey, value);
//   },
//   getKeys: function getKeys($$obj) {
//     return $$obj.keySeq().toArray();
//   },
//   isObjectOrMap: function isObjectOrMap($$item) {
//     return _immutable2.Map.isMap($$item);
//   },
//   isArrayOrList: function isArrayOrList($$item) {
//     return _immutable2.List.isList($$item);
//   },
//   push: function push($$arr, $$item) {
//     return $$arr.push($$item);
//   },
//   clone: function clone($$obj) {
//     return $$obj; // no need to clone since object is immutable
//   }
// };


var I = function I(item) {
  return _immutable2.default.fromJS({ key: item }).get('key');
};

describe('smartSetter', function () {

  var helper = function helper(subject) {

    it('works in trivial case', function () {
      var source = {};
      var target = {};
      var result = subject(source)(target);
      (0, _chai.expect)(result).to.deep.equal({});
    });

    it('merges by default, but can selectively replace', function () {
      var source = {
        key1: {
          key1key2: 'val12'
        },
        key2: {
          _replace: {
            key2key2: 'val22'
          }
        }
      };

      var target = {
        key1: {
          key1key1: 'val11'
        },
        key2: {
          key2key1: 'val21'
        },
        key3: 'val3'
      };

      var result = subject(source)(target);

      var expected = {
        key1: {
          key1key1: 'val11',
          key1key2: 'val12'
        },
        key2: {
          key2key2: 'val22'
        },
        key3: 'val3'
      };

      (0, _chai.expect)(result).to.deep.equal(expected);
    });

    it('can insert elements', function () {
      var source = {
        key1: {
          _insert: 'val12'
        }
      };
      var target = {
        key1: ['val11']
      };
      var result = subject(source)(target);
      var expected = {
        key1: ['val11', 'val12']
      };
      (0, _chai.expect)(result).to.deep.equal(expected);
    });

    it('can remove elements', function () {
      var source = {
        key1: {
          _remove: { id: 1 }
        }
      };
      var target = {
        key1: [{ id: 1, name: 'great' }, { id: 2, name: 'nice' }]
      };
      var result = subject(source)(target);
      var expected = {
        key1: [{ id: 2, name: 'nice' }]
      };
      (0, _chai.expect)(result).to.deep.equal(expected);
    });

    it('cuts through arrays', function () {
      var source = {
        key1: {
          "id=1": {
            name: 'name1Updated'
          }
        }
      };

      var target = {
        key1: [{ id: 1, name: 'name1' }, { id: 2, name: 'name2' }]
      };

      var result = subject(source)(target);
      var expected = {
        key1: [{ id: 1, name: 'name1Updated' }, { id: 2, name: 'name2' }]
      };
      (0, _chai.expect)(result).to.deep.equal(expected);
    });
  };

  describe('it works with object config', function () {
    helper((0, _index2.default)(_objectConfigForSmartSetter2.default));
  });

  describe('it works with immutable config', function () {
    var helper2 = function helper2(source) {
      return function (target) {
        var source2 = I(source);
        var target2 = I(target);
        var result = (0, _index2.default)(_immutableConfigForSmartSetter2.default)(source2)(target2);
        return result.toJS();
      };
    };
    helper(helper2);
  });
});