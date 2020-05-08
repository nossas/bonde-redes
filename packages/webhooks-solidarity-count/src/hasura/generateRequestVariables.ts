import R from "ramda";

const generateRequestVariables = R.pipe(
  R.addIndex(R.map)((i, index) =>
    R.pipe(j =>
      R.zip(
        R.pipe(
          R.keys,
          R.map(k => `${k}_${index}`)
        )(j),
        R.values(j)
      )
    )(i)
  ),
  R.unnest,
  R.fromPairs
);

export default generateRequestVariables;
