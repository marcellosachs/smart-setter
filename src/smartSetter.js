const _whiteList = (config, target, list) => {
  if (config.isArrayOrList(target)) {
   return target.filter(ele => {
     return list.includes(config.get(ele, 'name'))
   })
  } else if (config.isObjectOrMap(target)) {
    return list.reduce((acc, ele) => {
      const value = config.get(target, ele)
      return config.set(acc, ele, value)
    }, config.emptyObjectOrMap())
  } else {
    return target;
  }
}

const _blackList = (config, target, list) => {
  let totalList;
  if (config.isArrayOrList(target)) {
    totalList = target.map(ele => config.get(ele, ('name')))
  } else if (config.isObjectOrMap(target)) {
    totalList = config.getKeys(target)
  } else {
    return target;
  }
  const whiteList = totalList.filter(ele => !list.includes(ele))
  return _whiteList(config, target, whiteList)
}

const helper =  config => source => target => {

  let list;

  if (!config.isObjectOrMap(source)) return source
  if (target === null || target === undefined) return source
  return config.getKeys(source).reduce((acc, key) => {

    switch(key) {
      case '_replace':
        return config.get(source, key)
        break;

      case '_apply':
        const fn = config.get(source, key)
        const y1 =  fn(acc)
        return y1
        break;

      case '_insert':
        const newEle = config.get(source, key)
        const oldArr = acc
        return config.push(oldArr, newEle)
        break;

      case '_remove':
        const properties = config.get(source, key)
        const newArray = acc.filter(ele => (
          !config.getKeys(properties).reduce(
            (acc, key2) => acc && config.get(properties, key2) === config.get(ele,key2), true)
        ))
        return newArray;
        break;

      case '_whiteList':
        list = config.get(source, key)
        return _whiteList(config, acc, list)

      case '_blackList':
        list = config.get(source, key)
        return _blackList(config, acc, list)

      default:
        if (config.isArrayOrList(acc)) {
          const [propKey, propValue] = key.split("=")
          return acc.map(ele => {
            if (config.get(ele,propKey) == propValue) {
              return helper(config)(config.get(source, key))(ele)
            } else {
              return ele
            }
          })

        } else {
          const nextSource = config.get(source, key)
          const nextTarget = config.get(acc, key)
          const acc2 = config.set(acc, key, helper(config)(nextSource)(nextTarget))
          return acc2;
        }
        break;
    }
  }, config.clone(target))
}

const smartSetter = config => source => target => {
  const source2 = config.toThisConfigsType(source)
  return helper(config)(source2)(target)
}

export default smartSetter
