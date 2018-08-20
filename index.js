process.env.DEBUG = 'express:*,web-server:*,websocket-server:*';

require('./web-server');
require('./websocket-server');
