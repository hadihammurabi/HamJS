const dataTypes = {
  min: (min) => {
    return min
  },
  max: (max) => {
    return max
  },
  upperCase: (isupper) => {
    return isupper
  }
}

exports.string = () => {
  dataTypes.type = 'string'
  dataTypes.class = String
  return dataTypes
}
