import { google } from 'googleapis';
import assert from 'assert';
import express from 'express';

// Assert required enviroment variables for app
assert(process.env.GCLOUD_PROJECT !== undefined, 'Required enviroment variable GCLOUD_PROJECT');
assert(process.env.GOOGLE_APPLICATION_CREDENTIALS !== undefined, 'Required enviroment GOOGLE_APPLICATION_CREDENTIALS');
assert(process.env.GOOGLE_SPREADSHEET_ID !== undefined, 'Required enviroment GOOGLE_SPREADSHEET_ID');
assert(process.env.PORT !== undefined, 'Required enviroment PORT');

const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next))
    .catch(next);
};

const parseSpreadsheet = (rows) => {
  const rowKeys = {
    'first_name': 3,
    'last_name': 4,
    'state': 0,
    'city': 1,
    'expertness': 8
  };

  return rows.map(row => {
    const json = {};
    Object.keys(rowKeys).forEach(keyName => {
      json[keyName] = row[rowKeys[keyName]];
    });
    return json;
  });
};

const main = async (req, res, next) => {
  // Use GCLOUD_PROJECT and GOOGLE_APPLICATION_CREDENTIALS to authenticate
  // service-to-service on googleapis 
  const auth = await google.auth.getClient({
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
  });

  // Get values of GOOGLE_SPREADSHEET_ID
  // you need to give permission for your service account
  const sheets = google.sheets('v4');
  sheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
    range: 'A2:P'
  }, (err, sheetRes) => {
    if (err) {
      console.error('The API returned an error.');
      throw err;
    }

    console.log('The API returned with success!\n')
    const rows = sheetRes.data.values;
    if (rows.length === 0) {
      console.log('No data found.');
      return res.json([])
    } else {
      console.log('Parse spreadsheet start...\n');
      const jsonResponse = parseSpreadsheet(rows);
      console.log('Parse spreadsheet is done!\n')
      return res.json(jsonResponse);
    }
  });
}

const app = express();
const port = process.env.PORT;

app.get('/', asyncMiddleware(main));

app.listen(port, () => console.log(`Match Voluntarios App listening on port ${port}!`));

app.use(function(err, req, res, next) {
  console.error(err);
  res.status(500).json({message: 'an error occurred'});
});
