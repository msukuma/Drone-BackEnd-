const url = require('url');
const WebSocket = require('ws');
const getDistance = require('fast-haversine');
const debug = require('debug')('websocket-server:');
const {
  drones,
  findDrone,
  wssPort,
  clientsPath,
} = require('./shared-backend');

function parseId(pathname) {
  const parts = pathname.split('/');
  const idIndex = parts.length - 1;
  return parseInt(parts[idIndex]);
}

function isDrone(pathname) {
  return /\/drones\/\d+$/.test(pathname);
}

function isClient(pathname) {
  return pathname === clientsPath;
}

const wss = new WebSocket.Server({ port: wssPort });
const webClients = new Set();

wss.on('connection', function connection(ws, req) {
  let drone;
  let droneId;
  const { pathname } = url.parse(req.url);
  const isdrone = isDrone(pathname);
  const isclient = isClient(pathname);

  if (isdrone) {
    droneId = parseId(pathname);
    drone = findDrone(droneId);

    if (drone) {
      ws.drone = findDrone(droneId);

      ws.on('message', function incoming(loc) {
        loc = JSON.parse(loc);
        ws.drone.update(loc);

        const data = ws.drone.stringify();

        webClients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(data);
          }
        });

      });
    }
  } else if (isclient) {
    webClients.add(ws);
  }

  if (isdrone || isclient) {
    ws.on('error', err => debug(err));
    ws.on('close', (code, reason) => {
      webClients.delete(ws);
      debug(`connection to ${droneId} closed code: ${code}, reason: ${reason}`);
    });

    debug(`new connection from ${droneId ? droneId : 'web client'}`);
  } else {
    ws.close();
    debug(`invalid request req: ${req.url}`);
  }
});

wss.on('listening', () => {
  debug(`client WebSocket server listening on port ${wssPort}`);
});
