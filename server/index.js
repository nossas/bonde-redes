import { google } from 'googleapis';
import assert from 'assert';
import express from 'express';

assert(process.env.GCLOUD_PROJECT !== undefined, 'Required enviroment variable GCLOUD_PROJECT');
assert(process.env.GOOGLE_APPLICATION_CREDENTIALS !== undefined, 'Required enviroment GOOGLE_APPLICATION_CREDENTIALS');
assert(process.env.GOOGLE_SPREADSHEET_ID !== undefined, 'Required enviroment GOOGLE_SPREADSHEET_ID');
assert(process.env.PORT !== undefined, 'Required enviroment PORT');

const asyncMiddleware = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next))
        .catch(next);
};

async function main (req, res, next) {
    const auth = await google.auth.getClient({
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
    });

    // const project = await google.auth.getDefaultProjectId();
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
                jsonResponse.push({
                    name: row[0],
                    major: row[4]
                });
            }
            res.json(jsonResponse);
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
