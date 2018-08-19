const debug = require('debug')('web-server:server');
const ws = require('ws');
const url = require('url');
const { join } = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const Drone = require('./drone');
const app = express();
const server = app;
const { drones } = require('./shared-backend');
const {
  droneIds,
  webPort,
  dronesPath,
} = require('./shared');

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', [
   'Accept',
   'Authorization',
   'Content-Type',
   'Origin',
   'X-Requested-With',
  ].join(', '));
  res.header('Access-Control-Allow-Methods', 'GET');
  next();
});

app.use(express.static(join(__dirname, 'client', 'build')));

app.get('/', function (req, res) {
  res.sendFile(join(__dirname, 'client', 'build', 'index.html'));
});

app.get(dronesPath, function (req, res) {
  const data = drones.map(drone => drone.strip());

  res.json({ data });
});

app.listen(webPort, () => {
  debug(`API listening on port ${webPort}`);
});
