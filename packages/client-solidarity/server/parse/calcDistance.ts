import * as turf from "@turf/turf";

export default (pointA, pointB) => {
  const a = turf.point(pointA);
  const b = turf.point(pointB);

  return Number(turf.distance(a, b)).toFixed(2);
};
