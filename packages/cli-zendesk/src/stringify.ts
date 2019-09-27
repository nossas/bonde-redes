const stringify = (obj: any): any => {
  let result = ''
  if (obj instanceof Array) {
    result += '['
    obj.forEach(i => result += stringify(i))
    result += ']'
  } else if (obj && typeof obj === 'object') {
    const entries = Object.entries(obj)
    result += '{'
    for (const [a, b] of entries) {
      result += `${a}: ${stringify(b)}`
    }
    result += '}'
  } else {
    result += JSON.stringify(obj)
  }
  return result
}

export default stringify
