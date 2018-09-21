import calcDistance from './calcDistance'
import therapist from './therapist'
import lawyer from './lawyer'

export const spreadsheets = { therapist, lawyer }

export default (values, cols, from) => values
  .map((row) => {
    const item = {}
    Object.keys(cols).forEach((colName) => {
      item[colName] = row[cols[colName]]
    })

    // add distance column
    const lng = Number(item.lng)
    const lat = Number(item.lat)
    if (!isNaN(lng) && !isNaN(lng) && lat && from) {
      item.distance = calcDistance(from, [lng, lat])
    }

    return item
  })
