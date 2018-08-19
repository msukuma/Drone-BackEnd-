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

function round(n) {
  return parseFloat(n.toFixed(6));
}

function randCoordinate() {
  return round(Math.random() * 50 + 1);
}

function send(ws, data) {
  data = JSON.stringify(data);
  wait(Date.now() + 1000);
  ws.send(data);
}

function shouldStop(numStops) {
  // return numStops < MAX_STOPS && Math.random() * 10 < 3;
  return Math.random() * 10 < 1.5;
}

function updateLocation({ lat, lon }) {
  const inc = Math.random() / 100000;
  lat = round(lat + inc);
  lon = round(lon + inc);
  return { lat, lon };
}

function simulate(drone, duration) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const ws = new WebSocket(`ws://${host}:${dronePort}/${drone.id}/${drone.key}`);

      ws.on('open', () => {
        let until;
        let numStops = 0;
        const delay = 11000;
        let stop = timeAfter(duration);
        let location = {
          lat: randCoordinate(),
          lon: randCoordinate(),
        };
        const onWait = () => send(ws, location);

        while (Date.now() < stop) {
          if (shouldStop(numStops)) {
            console.log(`drone ${drone.id} is idling`);
            until = timeAfter(delay);

            if (until >= stop) {
              wait(stop - 200, onWait);
            } else {
              wait(until, onWait);
            }

            numStops++;
          } else {
            console.log(`drone ${drone.id} is moving`);
            location = updateLocation(location);
            send(ws, location);
          }
        }

        resolve(ws);
      });
    }, (Math.random() * 2000).toFixed(0));
  });
}

const droneId = parseInt(process.argv[2]);
const duration = parseInt(process.argv[3]) || undefined;

drone = findDrone(droneId);

if (drone) {
  simulate(drone, duration)
    .then(ws => ws.close())
    .catch(err => console.log(err));
}
