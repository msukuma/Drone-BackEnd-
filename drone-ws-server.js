const url = require('url');
const WebSocket = require('ws');
const getDistance = require('fast-haversine');
const debug = require('debug')('drone-wss:ws');
const { dronePort } = require('./shared');
const {
  drones,
  findDrone,
} = require('./shared-backend');

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

  ws.drone = findDrone(droneId, drones);

  ws.on('message', function incoming(loc) {
    loc = JSON.parse(loc);
    ws.drone.update(loc);

    const data = ws.drone.stringify();

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
