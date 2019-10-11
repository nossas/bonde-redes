import R from 'ramda'

export const generateRequestVariables = R.pipe(
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

export default generateRequestVariables
