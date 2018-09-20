import calcDistance from './calcDistance'
import therapist from './therapist'
import lawyer from './lawyer'

export const spreadsheets = { therapist, lawyer }

export default (values, cols, from) => values
  .map(row => {
    const item = {}
    Object.keys(cols).forEach(colName => {
      item[colName] = row[cols[colName]]
    })

    // add distance column
    if (item.lng && item.lat && from) {
      item.distance = calcDistance(from, [item.lng, item.lat])
    } else {
      item.distance = 0
    }

    return item
  })
