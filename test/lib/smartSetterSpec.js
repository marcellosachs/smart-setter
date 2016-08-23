'use strict';

var _chai = require('chai');

var _index = require('../../index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('smartSetter', function () {

  var subject = _index2.default;

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
});