const smartSetter = source => target => {
  if (typeof source !== 'object') return source
  return Object.keys(source).reduce((acc, key) => {
    if (key === '_replace') {
      return source[key]
    } else {
      const nextSource = source[key]
      const nextTarget = target[key]
      acc[key] = smartSetter(nextSource)(nextTarget)
      return acc;
    }
  }, Object.assign({}, target))
}

export default smartSetter
