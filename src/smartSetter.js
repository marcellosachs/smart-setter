const smartSetter =  config => source => target => {
  if (!config.isObject(source)) return source
  return config.getKeys(source).reduce((acc, key) => {
    switch(key) {
      case '_replace':
        return config.get(source, key)
        break;

      case '_insert':
        const newEle = config.get(source, key)
        const oldArr = target
        return config.push(oldArr, newEle)
        break;

      case '_remove':
        const properties = config.get(source, key)
        const newArray = target.filter(ele => (
          !config.getKeys(properties).reduce(
            (acc, key2) => acc && config.get(properties, key2) === config.get(ele,key2), true)
        ))
        return newArray;
        break;

      default:
        if (config.isArrayOrList(target)) {
          const [propKey, propValue] = key.split("=")
          return target.map(ele => {
            if (config.get(ele,propKey) == propValue) {
              return smartSetter(config)(config.get(source,key))(ele)
            } else {
              return ele
            }
          })

        } else {
          const nextSource = config.get(source,key)
          const nextTarget = config.get(target,key)
          const acc2 = config.set(acc, key, smartSetter(config)(nextSource)(nextTarget))
          return acc2;
        }
        break;
    }
  }, config.clone(target))
}

export default smartSetter
