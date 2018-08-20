const debug = require('debug')('web-server:');
const { join } = require('path');
const express = require('express');
const Drone = require('./drone');
const app = express();
const server = app;
const { drones } = require('./shared-backend');
const {
  droneIds,
  webPort,
  dronesPath,
} = require('./shared');

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
  debug(data);
  res.json({ data });
});

app.listen(webPort, () => {
  debug(`webserver listening on port ${webPort}`);
});
