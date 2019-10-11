import R from 'ramda'

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

export const stringifyVariables = R.pipe(
  R.addIndex(R.map)((i, index) => R.pipe(
    (j) => R.zip(
      R.pipe(
        R.keys,
        // j => j.map((i, indexI) => `${i}_${indexI}`)
        R.map((k) => `${k}_${index}`),
      )(j),
      R.values(j),
    ),
  )(i)),
  R.unnest,
  R.fromPairs,
)
