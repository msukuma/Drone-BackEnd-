const drones = (n => {
  const drones = [];

  for (let i = 0; i < n; i++) {
    drones.push({
      id: i,
      name: `name-${i}`,
      secret: i,
      location: {
        tenSecAgo: null,
        current: null,
      },
    });
  }

  return drones;
})(10);

module.exports = {
  drones,
  host: '0.0.0.0',
  webPort: 8000,
  dronePort: 8001,
  clientPort: 8002,
  dronesPath: '/drones',
};
