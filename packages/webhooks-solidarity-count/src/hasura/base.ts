import R from 'ramda'

export const generateRequestVariables = R.pipe(
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
