import turf from 'turf'

export default (x, y) => {
  const from = turf.point(x);
  const to = turf.point(y);

  return turf.distance(from, to);
};
