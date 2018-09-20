import therapist from './therapist'
import lawyer from './lawyer'

export const spreadsheets = { therapist, lawyer }

export default (values, cols) => values.map(row => {
  const item = {}
  Object.keys(cols).forEach(colName => {
    item[colName] = row[cols[colName]]
  })
  return item
})
