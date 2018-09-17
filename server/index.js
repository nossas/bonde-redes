import { google } from 'googleapis';
import assert from 'assert';
import express from 'express';

assert(process.env.GCLOUD_PROJECT !== undefined, 'Required enviroment variable GCLOUD_PROJECT');
assert(process.env.GOOGLE_APPLICATION_CREDENTIALS !== undefined, 'Required enviroment GOOGLE_APPLICATION_CREDENTIALS');
assert(process.env.GOOGLE_SPREADSHEET_ID !== undefined, 'Required enviroment GOOGLE_SPREADSHEET_ID');
assert(process.env.PORT !== undefined, 'Required enviroment PORT');


const asyncMiddleware = fn =>
      (req, res, next) => {
          Promise.resolve(fn(req, res, next))
              .catch(next);
      };

async function main (req, res, next) {

    // This method looks for the GCLOUD_PROJECT and GOOGLE_APPLICATION_CREDENTIALS
    // environment variables.
    const auth = await google.auth.getClient({
        // Scopes can be specified either as an array or as a single, space-delimited string.
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
    });

    // obtain the current project Id
    const project = await google.auth.getDefaultProjectId();
    const sheets = google.sheets('v4');
    sheets.spreadsheets.values.get({
        auth: auth,
        spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
        range: 'A2:E'
    }, (err, sheetRes) => {
        if (err) {
            console.error('The API returned an error.');
            throw err;
        }
        const rows = sheetRes.data.values;
        if (rows.length === 0) {
            console.log('No data found.');
        } else {
            console.log('Leitura da planilha realizada com sucesso!\n');
            const jsonResponse = [];

            for (const row of rows) {
                // Print columns A and E, which correspond to indices 0 and 4.
                // console.log(`${row[0]}, ${row[4]}`);
                jsonResponse.push({
                    name: row[0],
                    major: row[4]
                });
            }
            res.json(jsonResponse);
        }
    });
    // console.log(sheets);

    // Fetch the list of GCE zones within a project.
    // const res = await compute.zones.list({ project, auth });
    // console.log(res.data);
}

const app = express();
const port = process.env.PORT;

app.get('/', asyncMiddleware(main));

app.listen(port, () => console.log(`Match Voluntarios App listening on port ${port}!`));

app.use(function(err, req, res, next) {
    console.error(err);
    res.status(500).json({message: 'an error occurred'});
});
