const Drone = require('./drone');
const shared = require('./shared');
const {
  droneIds,
  droneIndex,
} = require('./shared');

const drones = droneIds.map(id => new Drone(id));

for (let key in shared) {
  exports[key] = shared[key];
}

exports.drones = drones;
exports.findDrone = function findDrone(id) {
  const i = droneIndex[id];
  return drones[i];
};
