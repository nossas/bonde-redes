import { google } from 'googleapis'
import parse, { spreadsheets } from './parse'

const main = async (req, res, next) => {
  const {
    serviceType, lat, lng, distance
  } = req.query

  if (serviceType !== 'therapist' && serviceType !== 'lawyer') {
    return res.status(400).json({ error: 'Query serviceType is invalid' })
  }

  const spreadsheet = spreadsheets[serviceType]

  // Use GCLOUD_PROJECT and GOOGLE_APPLICATION_CREDENTIALS to authenticate
  // service-to-service on googleapis
  const auth = await google.auth.getClient({
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
  })

  // Get values of GOOGLE_SPREADSHEET_ID
  // you need to give permission for your service account
  const sheets = google.sheets('v4')
  sheets.spreadsheets.values.get({
    auth,
    spreadsheetId: spreadsheet.id,
    range: 'A2:T'
  }, (err, sheetRes) => {
    if (err) {
      console.error('The API returned an error.')
      throw err
    }
    const rows = sheetRes.data.values
    // Parse rows and filter by distance
    const jsonResponse = parse(rows, spreadsheet.structure, [lng, lat])
      .filter(row => row.distance && row.distance < Number(distance))
      .sort((r1, r2) => r1.distance - r2.distance)
    return res.json(jsonResponse)
  })
}

export default main
