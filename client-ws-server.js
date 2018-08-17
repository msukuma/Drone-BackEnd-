const url = require('url');
const WebSocket = require('ws');
const debug = require('debug')('client-wss:ws');
const { clientPort } = require('./shared');
const noMask = false;
const clientWss = new WebSocket.Server({
  port: clientPort,
  clientTracking: true,
});

clientWss.on('connection', function connection(ws, req) {
  debug('new connection');
  ws.on('ping', data => {
    debug(`ping data: ${data}`);
    ws.pong();
  });

  ws.on('close', (code, reason) => {
    debug(`code: ${code}, reason: ${reason}`);
  });
});

clientWss.on('listening', () => {
  debug(`client WebSocket server listening on port ${clientPort}`);
});

module.exports = clientWss;
