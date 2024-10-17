const express = require('express');
const apiRouter = express.Router();
const createEnvelope = require('/')

apiRouter.get('/', (err, req, res, next) => {
    // get all envelopes
});

apiRouter.post('/', (err, req, res, next) => {
    // create a new envelope
});

apiRouter.get('/:envelopeId', (err, req, res, next) => {
    // get a specific envelope
});

apiRouter.post('/:envelopeId', (err, req, res, next) => {
    // v1: completely rewrite the amount in a specific envelope
    // v2: add/subtract money to/from a specific envelope
});

apiRouter.put('/:envelopeId', (err, req, res, next) => {
    // change specific envelope name
});

apiRouter.delete('/:envelopeId', (err, req, res, next) => {
    // delete specific envelope
});



apiRouter.post('/', (req, res, next) => {
    const bodyContent = req.body;
    console.log(bodyContent);
    if (JSON.stringify(bodyContent) !== "{}") {
        // add something to the database
        res.status(201).send(JSON.stringify(bodyContent));
    } else {
        res.status(400).send("The body is empty!");
    }
});




module.exports = apiRouter;
