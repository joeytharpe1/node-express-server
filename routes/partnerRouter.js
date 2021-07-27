const express = require("express");
const partnerRouter = express.Router();

partnerRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res) => {
        res.end(`Will send all the partners to you`);
    })
    .post((req, res) => {
        res.end(`will add the partner: ${req.body.name} with description ${req.body.description}`)
    })
    .put((req, res) => {
        res.statusCode = 403;
        res.end(`Put operation not supported on /Partners`);
    })
    .delete((req, res) => {
        res.end(`Deleting all partners`);
    })

partnerRouter.route('/:partnerId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('content-Type', 'text/plain');
        next();
    })
    .get((req, res) => {
        res.end(`Will send details of the partner: ${req.params.partnerId} to you`);
    })
    .post((req, res) => {
        res.statusCode = 403;
        res.end(`Post operation not supported on /patners/${req.params.partnerId}`);
    })
    .put((req, res) => {
        res.write(`updating the partner: ${req.params.partnerId}\n`);
        res.end(`Will update the partner: ${req.body.name} with description ${req.body.description}`);
    })
    .delete((req, res) => {
        res.end(`Deleting partner: ${req.params.partnerId}`);
    })

module.exports = partnerRouter;