const uuidv5 = require('uuid/v5');
const host = '0.0.0.0';
const namespace = uuidv5(host, uuidv5.DNS);

const { drones, droneIndex } = (n => {
  const drones = [];
  const droneIndex = {};
  let id;
  let key;

  for (let i = 0; i < n; i++) {
    id = 100000 + i;
    key = uuidv5(id.toString(), namespace);
    drones.push({
      id,
      key,
      tracker: {
        time: 0,
        speed: 0,
        moving: false,
        max: 0,
        anchor: null,
      },
    });

    droneIndex[id] = i;
  }

  return { drones, droneIndex };
})(10);

function findDrone(id) {
  const i = droneIndex[id];

  return drones[i];
}

function stripDrone(drone) {
  const {
    id,
    tracker: { speed, moving },
  } = drone;

  return { id, speed, moving };
}

module.exports = {
  drones,
  droneIndex,
  findDrone,
  stripDrone,
  host,
  webPort: 8000,
  dronePort: 8001,
  clientPort: 8002,
  dronesPath: '/drones',
};
