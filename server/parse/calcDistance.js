import turf from 'turf'

export default (x, y) => {
  const from = turf.point(x)
  const to = turf.point(y)

  return Number(turf.distance(from, to)).toFixed(2)
}
