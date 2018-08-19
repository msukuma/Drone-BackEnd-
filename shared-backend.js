const Drone = require('./drone');
const {
  droneIds,
  droneIndex,
} = require('./shared');
const drones = droneIds.map(id => new Drone(id));

function findDrone(id) {
  const i = droneIndex[id];

  return drones[i];
}

module.exports = { drones, findDrone };
