import assert from 'assert';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';

import api from './api.js';

// Assert required enviroment variables for app
assert(process.env.GCLOUD_PROJECT !== undefined, 'Required enviroment variable GCLOUD_PROJECT');
assert(process.env.GOOGLE_APPLICATION_CREDENTIALS !== undefined, 'Required enviroment GOOGLE_APPLICATION_CREDENTIALS');
assert(process.env.PORT !== undefined, 'Required enviroment PORT');

const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next))
    .catch(next);
};

const app = express();
const port = process.env.PORT;

app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));
app.use(cors());
app.use(express.static(path.resolve(__dirname, '..', 'build')));
app.use(function(err, req, res, next) {
    console.error(err);
    res.status(500).json({message: 'an error occurred'});
});

app.get('/api', asyncMiddleware(api));
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

app.listen(port, () => console.log(`Match Voluntarios App listening on port ${port}!`));
