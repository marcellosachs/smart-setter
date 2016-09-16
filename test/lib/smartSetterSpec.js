'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _chai = require('chai');

var _index = require('../../index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var plainObjConfig = {
  get: function get(obj, propKey) {
    return obj[propKey];
  },
  set: function set(obj, propKey, value) {
    var newObj = Object.assign({}, obj);
    newObj[propKey] = value;
    return newObj;
  },
  getKeys: function getKeys(obj) {
    return Object.keys(obj);
  },
  isObject: function isObject(item) {
    return (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object';
  },
  isArrayOrList: function isArrayOrList(item) {
    return Array.isArray(item);
  },
  push: function push(arr, item) {
    return arr.concat([item]);
  },
  clone: function clone(obj) {
    return Object.assign({}, obj);
  }
};

describe('smartSetter', function () {

  var subject = (0, _index2.default)(plainObjConfig);

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
});