const url = require('url');
const WebSocket = require('ws');
const getDistance = require('fast-haversine');
const debug = require('debug')('websocket-server:');
const { wssPort } = require('./shared');
const {
  drones,
  findDrone,
} = require('./shared-backend');

function parseId(pathname) {
  return parseInt(pathname.split('/')[1]);
}

function isDrone(pathname) {
  return /\/\d+$/.test(pathname);
}

const wss = new WebSocket.Server({ port: wssPort });
wss.webClients = new Set();

wss.on('connection', function connection(ws, req) {
  const { pathname } = url.parse(req.url);
  let droneId;

  if (isDrone(pathname)) {
    droneId = parseId(pathname);
    ws.drone = findDrone(droneId, drones);

    ws.on('message', function incoming(loc) {
      loc = JSON.parse(loc);
      ws.drone.update(loc);

      const data = ws.drone.stringify();

      wss.webClients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      });

    });
  } else {
    wss.webClients.add(ws);
  }

  ws.on('error', err => debug(err));
  ws.on('close', (code, reason) => {
    wss.webClients.delete(ws);
    debug(`connection to ${droneId} closed code: ${code}, reason: ${reason}`);
  });

  debug(`new connection from ${droneId ? droneId : 'web client'}`);
});

wss.on('listening', () => {
  debug(`client WebSocket server listening on port ${wssPort}`);
});
