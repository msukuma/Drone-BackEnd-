const { random, round } = require('lodash');
const WebSocket = require('ws');
const MAX_STOPS = 2;
const {
  drones,
  findDrone,
  host,
  dronePort,
} = require('../shared');

function timeAfter(duration) {
  return Date.now() + duration;
}

function wait(end, cb) {
  if (cb) {
    while (Date.now() < end)
      cb();
  } else {
    while (Date.now() < end)
      ;
  }
}

function send(ws, data) {
  data = JSON.stringify(data);
  wait(Date.now() + 1000);
  ws.send(data);
}

function shouldStop(numStops) {
  return random(10) < 2;
}

function updateLocation({ lat, lon }) {
  const inc = random(0.000001, 0.00005);
  lat = round(lat + inc, 6);
  lon = round(lon + inc, 6);
  return { lat, lon };
}

function simulate(drone, duration) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const ws = new WebSocket(`ws://${host}:${dronePort}/${drone.id}/${drone.key}`);

      ws.on('open', () => {
        let until;
        const delay = 11000;
        let stop = timeAfter(duration);
        let location = {
          lat: round(random(-85.05, 85), 6),
          lon: round(random(-180.01, 180), 6),
        };
        const onWait = () => send(ws, location);

        while (Date.now() < stop) {
          if (shouldStop()) {
            until = timeAfter(delay);

            if (until >= stop) {
              wait(stop - 200, onWait);
            } else {
              wait(until, onWait);
            }
          } else {
            location = updateLocation(location);
            send(ws, location);
          }
        }

        resolve(ws);
      });
    }, random(2000));
  });
}

const droneId = parseInt(process.argv[2]);
const duration = parseInt(process.argv[3]) || undefined;

drone = findDrone(droneId);

if (drone) {
  simulate(drone, duration)
    .then(ws => ws.close())
    .catch(err => console.error(err));
}
