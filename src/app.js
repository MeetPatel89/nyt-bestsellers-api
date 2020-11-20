require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const books = require('./books');

const app = express();

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello, nyt-bestsellers!');
});

app.get('/books', (req, res) => {
    const queryObj = req.query;
    const { search = "", sort } = queryObj;
    let results = books.filter(book => book.title.toLowerCase().includes(search.toLowerCase()));
    if (!Object.keys(queryObj).length) {
        console.log('The books code ran');
        res.json(books);
    } else {
        console.log('The results code ran');
        res.json(results);
    }
});

app.use(errorHandler = (error, req, res, next) => {
    let response;
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error'}};
    } else {
        console.error(error);
        response = { message: error.message, error }
    }
    res.status(500).json(response);

})

module.exports = app;
