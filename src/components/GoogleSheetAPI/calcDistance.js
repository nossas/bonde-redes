import turf from 'turf'

export default (x, y) => {
  const from = turf.point(x);
  const to = turf.point(y);
  const opts = { unit: 'kilometers' }

  return turf.distance(from, to, opts);
};
