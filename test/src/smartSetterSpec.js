import { expect } from 'chai';
import smartSetter from '../../index'

describe('smartSetter', () => {

  const subject = smartSetter

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
})