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
          key2key1: {
            key2key1key1: {
              _replace: {
                key2key1key1key2: 'val22'
              }
            }
          }
        }
      };

      var target = {
        key1: {
          key1key1: 'val11'
        },
        key2: {
          key2key1: {
            key2key1key1: {
              key2key1key1key1: 'val21'
            }
          }
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
          key2key1: {
            key2key1key1: {
              key2key1key1key2: 'val22'
            }
          }
        },
        key3: 'val3'
      };

      (0, _chai.expect)(result).to.deep.equal(expected);
    });

    it('replace works when keyPath doesnt exist on target', function () {
      var source = {
        key2: {
          _replace: {
            key2key2: 'val21'
          }
        }
      };

      var target = {
        key1: 'val1'
      };

      var result = subject(source)(target);

      var expected = {
        key1: 'val1',
        key2: {
          key2key2: 'val21'
        }
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

    it('whitelisting works', function () {
      var source = {
        key1: {
          key2: {
            _whiteList: ['key11', 'key12']
          }
        },
        key2: {
          _whiteList: ['key21', 'key22']
        }
      };

      var target = {
        key1: {
          key2: {
            key11: 'val11',
            key12: 'val12',
            key13: 'val13'
          }
        },
        key2: [{ name: 'key21', value: 'val21' }, { name: 'key22', value: 'val22' }, { name: 'key23', value: 'val23' }]
      };

      var expected = {
        key1: {
          key2: {
            key11: 'val11',
            key12: 'val12'
          }
        },
        key2: [{ name: 'key21', value: 'val21' }, { name: 'key22', value: 'val22' }]
      };

      var result = subject(source)(target);

      (0, _chai.expect)(result).to.deep.equal(expected);
    });

    it('blacklisting works', function () {
      var source = {
        key1: {
          _blackList: ['key11', 'key12']
        },
        key2: {
          _blackList: ['key21', 'key22']
        }
      };

      var target = {
        key1: {
          key11: 'val11',
          key12: 'val12',
          key13: 'val13'
        },
        key2: [{ name: 'key21', value: 'val21' }, { name: 'key22', value: 'val22' }, { name: 'key23', value: 'val23' }]
      };

      var expected = {
        key1: {
          key13: 'val13'
        },
        key2: [{ name: 'key23', value: 'val23' }]
      };

      var result = subject(source)(target);

      (0, _chai.expect)(result).to.deep.equal(expected);
    });

    it('handles multiple array operations in a row', function () {
      var source = {
        key1: {
          _whiteList: ['name1', 'name2'],
          "id=1": {
            name: 'name1Updated'
          }
        }
      };

      var target = {
        key1: [{ id: 1, name: 'name1' }, { id: 2, name: 'name2' }, { id: 3, name: 'name3' }]
      };

      var result = subject(source)(target);
      var expected = {
        key1: [{ id: 1, name: 'name1Updated' }, { id: 2, name: 'name2' }]
      };
      (0, _chai.expect)(result).to.deep.equal(expected);
    });

    it('creates paths when they dont exist', function () {
      var source = {
        general: {
          modalMessage: {
            text: 'saved!', type: 'info'
          }
        }
      };
      var target = {
        general: {
          formFields: []
        },
        componentEnumeration: []
      };

      var x = subject(source)(target);
      var expected = {
        general: {
          formFields: [],
          modalMessage: { text: 'saved!', type: 'info' }
        },
        componentEnumeration: []
      };
      (0, _chai.expect)(x).to.deep.equal(expected);
    });

    it('applies a function', function () {
      var source = {
        key1: {
          key2: {
            _apply: function _apply(str) {
              return str + 'NewTail';
            }
          }
        }
      };
      var target = {
        key1: {
          key2: 'val'
        }
      };
      var x = subject(source)(target);
      var expected = {
        key1: {
          key2: 'valNewTail'
        }
      };
      (0, _chai.expect)(x).to.deep.equal(expected);
    });
  };

  describe('it works with object config', function () {
    helper((0, _index2.default)(_objectConfigForSmartSetter2.default));
  });

  describe('it works with immutable config', function () {
    var helper2 = function helper2(source) {
      return function (target) {
        var target2 = I(target);
        var result = (0, _index2.default)(_immutableConfigForSmartSetter2.default)(source)(target2);
        return result.toJS();
      };
    };
    helper(helper2);
  });
});