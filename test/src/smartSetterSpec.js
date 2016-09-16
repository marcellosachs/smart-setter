import { expect } from 'chai';
import smartSetter from '../../index'

const plainObjConfig = {
  get: (obj, propKey) => {
    return obj[propKey]
  },
  set: (obj, propKey, value) => {
    var newObj = Object.assign({}, obj)
    newObj[propKey] = value
    return newObj;
  },
  getKeys: obj => {
    return Object.keys(obj)
  },
  isObject: item => {
    return typeof item === 'object'
  },
  isArrayOrList: item => {
    return Array.isArray(item)
  },
  push: (arr, item) => {
    return arr.concat([item])
  },
  clone: obj => {
    return Object.assign({}, obj)
  },
}

describe('smartSetter', () => {

  const subject = smartSetter(plainObjConfig)

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

})
