const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4001;
const apiRouter = require('./server/api');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', apiRouter);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

module.exports = app;
