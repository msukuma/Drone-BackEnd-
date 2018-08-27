const Drone = require('./drone');
const shared = require('./shared');
const {
  droneIds,
  droneIndex,
} = require('./shared');

const drones = droneIds.map(id => new Drone(id));

for (let key in shared) {
  module.exports[key] = shared[key];
}

module.exports.drones = drones;
module.exports.findDrone = function findDrone(id) {
  const i = droneIndex[id];
  return drones[i];
};
