# Install
`npm install --save smart-setter`

# Usage
```
import smartSetter from 'smartSetter'

const obj1 = {
  key1: {
    key11: 'val11',
  },
  key2: {
    key21: 'val21',
  },
  key3: ['val31'],
  key4: [
    {id: 1, name: 'name1'},
    {id: 2, name: 'name2'},
  ],
  key5: [
    {id: 3, name: 'name3'},
    {id: 4, name: 'name4'},
  ],
}

const setterSpecification = {
  key1: {
    key12: 'val12',
  },
  key2: {
    _replace: {
      key22: 'val22',
    },
  },
  key3: {
    _insert: 'val32',
  },
  key4: {
    _remove: {id: 1},
    _insert: {id: 5, name: 'name5'},
  },
  key5: {
    "id=3": {
      name: "name3Updated",
      foo: "bar",
    }
  }
}

const obj2 = smart(setterSpecification)(obj1)

```
This results in the following new object (`obj1` remains unchanged) :
```
{
  key1: {
    key11: 'val11',
    key12: 'val12',
  },
  key2: {
    key22: 'val22',
  },
  key3: ['val31', 'val32',],
  key4: [
    {id: 2, name: 'name2'},
    {id: 5, name: 'name5'}
  ],
  key5: [
    {id: 3, name: 'name3Updated', foo: 'bar'},
    {id: 4, name: 'name4'},
  ],
}
```
