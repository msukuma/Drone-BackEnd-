const ip = require('ip');
const host = ip.address();

const { droneIds, droneIndex } = (()=> {
  let id;
  let base = 100000;
  const droneIds = [];
  const droneIndex = {};

  for (let i = 0; i < 10; i++) {
    id = base + i;
    droneIds.push(id);
    droneIndex[id] = i;
  }

  return { droneIds, droneIndex };
})();

module.exports = {
  droneIds,
  droneIndex,
  host,
  webPort: 8000,
  wssPort: 8001,
  clientsPath: '/clients',
  dronesPath: '/drones',
};
