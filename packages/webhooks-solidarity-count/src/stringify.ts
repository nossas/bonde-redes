export const stringify = (obj: any): any => {
  let result = ''
  if (obj instanceof Array) {
    result += '['
    obj.forEach((i) => {
      result += stringify(i)
    })
    result += ']'
  } else if (obj && typeof obj === 'object') {
    const entries = Object.entries(obj)
    result += '{'
    for (let i = 0; i < entries.length; i += 1) {
      result += `${entries[i][0]}: ${stringify(entries[i][1])}`
      if (i < entries.length - 1) {
        result += ','
      }
    }
    result += '}'
  } else {
    result += JSON.stringify(obj)
  }
  return result
}

export default stringify
