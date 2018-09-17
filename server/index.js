import { google } from 'googleapis';
import assert from 'assert';

assert(process.env.GCLOUD_PROJECT !== undefined, 'Required enviroment variable GCLOUD_PROJECT');
assert(process.env.GOOGLE_APPLICATION_CREDENTIALS !== undefined, 'Required enviroment GOOGLE_APPLICATION_CREDENTIALS');
assert(process.env.GOOGLE_SPREADSHEET_ID !== undefined, 'Required enviroment GOOGLE_SPREADSHEET_ID');

async function main () {

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
    }, (err, res) => {
        if (err) {
            console.error('The API returned an error.');
            throw err;
        }
        const rows = res.data.values;
        if (rows.length === 0) {
            console.log('No data found.');
        } else {
            console.log('Name, Major:');
            for (const row of rows) {
                // Print columns A and E, which correspond to indices 0 and 4.
                console.log(`${row[0]}, ${row[4]}`);
            }
        }
    });
    // console.log(sheets);

    // Fetch the list of GCE zones within a project.
    // const res = await compute.zones.list({ project, auth });
    // console.log(res.data);
}

main().catch(console.error);
