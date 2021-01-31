// packages
require('dotenv').config();
const http = require('http');
const express = require('express');
const basicAuth = require('express-basic-auth');
const bodyParser = require('body-parser');
const morgan = require('morgan');

// modules
const pushover = require('./pushover');
const cppm = require('./cppm');
const hass = require('./hass');

// ENVs
let requiredEnv = ['CPPM_FQDN', 'CPPM_CLIENT_ID', 'CPPM_CLIENT_SECRET', 'HASS_TOKEN', 'HASS_FQDN', 'APP_USERNAME', 'APP_PASSWORD'];
let unsetEnv = requiredEnv.filter((env) => !(typeof process.env[env] !== 'undefined'));
if (unsetEnv.length > 0) {
    throw new Error("Required ENV variables are not set: [" + unsetEnv.join(', ') + "]")
};

let webPort = 5031;
if (process.env.APP_PORT) {
    webPort = process.env.APP_PORT;
};

let appDebug = false;
if (process.env.APP_DEBUG) {
    if (process.env.APP_DEBUG.match(/true/i)) {
        appDebug = true;
    }
};

// Express instantiation
const app = express();
if (appDebug) { app.use(morgan('combined')) };

// HTTP Basic Auth
let users = {};
users[process.env.APP_USERNAME] = process.env.APP_PASSWORD;
app.use(basicAuth({
    users,
    challenge: true
}));

// Root - Return 200
app.get('/', async (req, res) => {
    res.status(200).end();
});

// CPPM Endpoints
app.get('/cppm/session-count', async (req, res) => {
    try {
        sessions = await cppm.fetchCppmSessionCount();
        res.send(`${sessions.count}`).status(200).end();
    } catch {
        res.status(500).end();
    }
});

// Home Assistant Endpoints
app.post('/hass/presence-update', bodyParser.json(), async (req, res) => {
    if (appDebug) { console.info(`[hass/presence-update] Request Body:\n${JSON.stringify(req.body, null, 2)}`) };

    if (req.body['hassEntityId'] && req.body['state']) {
        hassResponse = await hass.updateHassPresence(req.body['hassEntityId'], req.body['state']);
        if (appDebug) { console.info(`[hass/presence-update] Hass Response: \n${JSON.stringify(hassResponse, null, 2)}`) };
        res.status(200).send(hassResponse).end();
    } else {
        res.status(400).send({ sendPushoverMessage: "required keys missing" }).end();
    }
});

// Pushover Endpoints
let lastDevice = {};
app.post('/pushover/send-message', bodyParser.json(), async (req, res) => {

    if (req.body['user'] && req.body['token']) {
        let oneMinuteAgo = Date.now() - 60000;
        // Handle rate limiting (1 request for same MAC per minute)
        if (req.body['mac'] == lastDevice['mac'] && lastDevice['time'] > oneMinuteAgo) {
            if (appDebug) { console.error(`[pushover/send-message] Duplicate request. Not sending message.`) };
            lastDevice = { mac: req.body['mac'], time: Date.now() };
            res.status(400).send({ reason: "Duplicate request" }).end();
        } else {
            if (appDebug) { console.info(`[pushover/send-message] Request Body: \n${JSON.stringify(req.body, null, 2)}`) };
            if (appDebug) { console.info('[pushover/send-message] Valid request received. Attempting to send.') };

            poResponse = await pushover.sendPushoverMessage(req.body);

            if (appDebug) { console.info(`[pushover/send-message] PO Response: \n${JSON.stringify(poResponse, null, 2)}`) };
            lastDevice = { mac: req.body['mac'], time: Date.now() };
            res.status(200).send(poResponse).end();

        }
    } else {
        if (appDebug) { console.error(`[pushover/send-message] Invalid request. \n${JSON.stringify(req.body, null, 2)}`) };
        res.status(400).send({ message: "required keys missing" }).end();
    }
});

// Start web server
var httpsServer = http.createServer(app);
httpsServer.listen(webPort, () => console.log(`App now running on port ${webPort}!\nDebug: ${appDebug}`));