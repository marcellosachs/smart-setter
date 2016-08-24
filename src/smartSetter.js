const smartSetter = source => target => {
  if (typeof source !== 'object') return source
  return Object.keys(source).reduce((acc, key) => {
    switch(key) {
      case '_replace':
        return source[key]
        break;

      case '_insert':
        const newEle = source[key]
        const oldArr = target
        return oldArr.concat([newEle])
        break;

      case '_remove':
        const properties = source[key]
        const newArray = target.filter(ele => (
          !Object.keys(properties).reduce((acc, key2) => acc && properties[key2] === ele[key2], true)
        ))
        return newArray;
        break;

      default:
        if (Array.isArray(target)) {
          const [propKey, propValue] = key.split("=")
          return target.map(function (ele) {
            if (ele[propKey] == propValue) {
              return smartSetter(source[key])(ele)
            } else {
              return ele
            }
          })

        } else {
          const nextSource = source[key]
          const nextTarget = target[key]
          acc[key] = smartSetter(nextSource)(nextTarget)
          return acc;
        }
        break;
    }
  }, Object.assign({}, target))
}

export default smartSetter
