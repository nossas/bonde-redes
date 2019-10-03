import R from 'ramda'

export const stringify = (obj: any): any => {
  let result = ''
  if (obj instanceof Array) {
    result += '['
    obj.forEach(i => result += stringify(i))
    result += ']'
  } else if (obj && typeof obj === 'object') {
    const entries = Object.entries(obj)
    result += '{'
    for (let i = 0; i < entries.length; ++i) {
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

export const stringifyVariables = R.pipe(
  R.addIndex(R.map)((i, index) => R.pipe(
    i => R.zip(
      R.pipe(
        R.keys,
        // j => j.map((i, indexI) => `${i}_${indexI}`)
        R.map(i => `${i}_${index}`)
      )(i),
      R.values(i)
    )
  )(i)),
  R.unnest,
  R.fromPairs
)
