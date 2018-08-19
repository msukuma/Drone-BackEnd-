const { join } = require('path');
const { spawn } = require('child_process');
const { drones } = require('../shared-backend');
const simPath = join(__dirname, 'simulate.js');
let duration = parseInt(process.argv[2]) * 1000 || 300000;

drones.forEach(drone => {
  sim = spawn('node', [simPath, drone.id, duration]);
  sim.stdout.on('data', data => console.log(data.toString()));
  sim.stderr.on('data', data => console.log(data.toString()));
  sim.on('close', data => console.log(`drone ${drone.id} simulation complete`));
});
