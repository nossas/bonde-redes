import therapist from './therapist'
import lawyers from './lawyers'

export const spreadsheets = { therapist, lawyers }

export default (values, cols) => values.map(row => {
  const item = {}
  Object.keys(cols).forEach(colName => {
    item[colName] = row[cols[colName]]
  })
  return item
})
