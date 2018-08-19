process.env.DEBUG = 'express:*,web-server:*,client-wss:*,drone-wss:*';

require('./web-server');
require('./drone-ws-server');
