const url = require('url');
const WebSocket = require('ws');
const getDistance = require('fast-haversine');
const debug = require('debug')('drone-wss:ws');
const {
  drones,
  findDrone,
  dronePort,
  stripDrone,
} = require('./shared');
const clientWss = require('./client-ws-server');

function parseId(pathname) {
  return parseInt(pathname.split('/')[1]);
}

function valid({ pathname, query }) {
  let id;

  if (!/\/\d+$/.test(pathname)) {
    return false;
  }

  id = parseId(pathname);

  if (!drones[id]) {
    return false;
  }

  if (!query.key || query.key !== drones[id].key) {
    return false;
  }

  return id;
}

function speed(tracker, distance, time) {
  if (tracker.time === time) {
    return tracker.speed;
  }

  return (distance / ((time - tracker.time) / 1000)).toFixed(2);
}

function updateDrone(drone, location) {
  const tracker = drone.tracker;
  const time = Date.now();
  let distance;
  let duration;

  if (tracker.time) {
    duration = time - tracker.time;

    // check that drone is moving
    if (duration > 10000) {
      tracker.time = time;
      tracker.anchor = location;
      tracker.moving = tracker.max > 1;
      tracker.max = 0;
    }
  } else {
    tracker.time = time;
    tracker.anchor = location;
  }

  distance = getDistance(tracker.anchor, location);
  tracker.speed = speed(tracker, distance, time);

  if (distance > tracker.max) {
    tracker.max = distance;
  }
}

const droneWss = new WebSocket.Server({
  verify: function (info, cb) {
    const { pathname, query } = url.parse(info.req.url, true);
    const res = { result: true };

    if (!valid({ pathname, query })) {
      res.result = false;
      res.code = 400;
    }

    return res;
  },

  port: dronePort,
});

droneWss.on('connection', function connection(ws, req) {
  const { pathname } = url.parse(req.url, true);
  const droneId = parseId(pathname);

  ws.drone = findDrone(droneId);

  ws.on('message', function incoming(loc) {
    loc = JSON.parse(loc);
    updateDrone(ws.drone, loc);

    const data = JSON.stringify(stripDrone(ws.drone));

    clientWss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });

  });

  ws.on('error', err => debug(err));
  ws.on('close', (code, reason) => {
    debug(`connection to ${droneId} closed code: ${code}, reason: ${reason}`);
  });

  debug(`new connection from ${droneId}`);
});

droneWss.on('listening', () => {
  debug(`client WebSocket server listening on port ${dronePort}`);
});

module.exports = droneWss;
