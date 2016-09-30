import { expect } from 'chai';
import smartSetter from '../../index'
import objectConfigForSmartSetter from 'object-config-for-smart-setter';
import immutableConfigForSmartSetter from 'immutable-config-for-smart-setter';
import Immutable from 'immutable'

const I = item => Immutable.fromJS({key: item}).get('key')

describe('smartSetter', () => {

  const helper = subject => {

    it('works in trivial case', () => {
      const source = {}
      const target = {}
      const result = subject(source)(target)
      expect(result).to.deep.equal({})
    })

    it('merges by default, but can selectively replace', () => {
      const source = {
        key1: {
          key1key2: 'val12',
        },
        key2: {
          _replace: {
            key2key2: 'val22',
          },
        },
      }

      const target = {
        key1: {
          key1key1: 'val11',
        },
        key2: {
          key2key1: 'val21',
        },
        key3: 'val3'
      }


      const result = subject(source)(target)

      const expected = {
        key1: {
          key1key1: 'val11',
          key1key2: 'val12',
        },
        key2: {
          key2key2: 'val22',
        },
        key3: 'val3',
      }

      expect(result).to.deep.equal(expected)

    })

    it('can insert elements', () => {
      const source = {
        key1: {
          _insert: 'val12'
        }
      }
      const target = {
        key1: ['val11']
      }
      const result = subject(source)(target)
      const expected = {
        key1: ['val11', 'val12']
      }
      expect(result).to.deep.equal(expected)
    })

    it('can remove elements', () => {
      const source = {
        key1: {
          _remove: {id: 1}
        }
      }
      const target = {
        key1: [{id: 1, name: 'great'}, {id: 2, name: 'nice'}]
      }
      const result = subject(source)(target)
      const expected = {
        key1: [{id: 2, name: 'nice'}]
      }
      expect(result).to.deep.equal(expected)
    })

    it('cuts through arrays', () => {
      const source = {
        key1: {
          "id=1": {
            name: 'name1Updated',
          },
        },
      }

      const target = {
        key1: [
          {id: 1, name: 'name1'},
          {id: 2, name: 'name2'},
        ]
      }

      const result = subject(source)(target)
      const expected = {
        key1: [
          {id: 1, name: 'name1Updated'},
          {id: 2, name: 'name2'},
        ],
      }
      expect(result).to.deep.equal(expected)
    })

    it('whitelisting works', () => {
      const source = {
        key1: {
          key2: {
            _whiteList: ['key11', 'key12'],
          }
        },
        key2: {
          _whiteList: ['key21', 'key22'],
        }
      }

      const target = {
        key1: {
          key2: {
            key11: 'val11',
            key12: 'val12',
            key13: 'val13',
          },
        },
        key2: [
          {name: 'key21', value: 'val21'},
          {name: 'key22', value: 'val22'},
          {name: 'key23', value: 'val23'},
        ],
      }

      const expected = {
        key1: {
          key2: {
            key11: 'val11',
            key12: 'val12',
          },
        },
        key2: [
          {name: 'key21', value: 'val21'},
          {name: 'key22', value: 'val22'},
        ],
      }

      const result = subject(source)(target)

      expect(result).to.deep.equal(expected)
    })

    it('blacklisting works', () => {
      const source = {
        key1: {
          _blackList: ['key11', 'key12'],
        },
        key2: {
          _blackList: ['key21', 'key22'],
        }
      }

      const target = {
        key1: {
          key11: 'val11',
          key12: 'val12',
          key13: 'val13',
        },
        key2: [
          {name: 'key21', value: 'val21'},
          {name: 'key22', value: 'val22'},
          {name: 'key23', value: 'val23'},
        ],
      }

      const expected = {
        key1: {
          key13: 'val13',
        },
        key2: [
          {name: 'key23', value: 'val23'},
        ],
      }

      const result = subject(source)(target)

      expect(result).to.deep.equal(expected)
    })

    it('creates paths when they dont exist', () => {
      const source = {
        general: {
          modalMessage: {
            text: 'saved!', type: 'info'
          }
        }
      }
      const target = {
        general: {
          formFields: [],
        },
        componentEnumeration: []
      }

      const x = subject(source)(target)
      const expected = {
        general: {
          formFields: [],
          modalMessage: {text: 'saved!', type: 'info'}
        },
        componentEnumeration: [],
      }
      expect(x).to.deep.equal(expected)
    })
  }

  describe('it works with object config', () => {
    helper(smartSetter(objectConfigForSmartSetter))
  })

  describe('it works with immutable config', () => {
    const helper2 = source => target => {
      const target2 = I(target)
      const result = smartSetter(immutableConfigForSmartSetter)(source)(target2)
      return result.toJS()
    }
    helper(helper2)
  })
})
