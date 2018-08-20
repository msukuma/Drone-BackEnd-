const calcDistance = require('fast-haversine');

const calcSpeed = (tracker, distance, time) => {
  if (tracker.time === time) {
    return tracker.speed;
  }

  return (distance / ((time - tracker.time) / 1000)).toFixed(2);
};

class Drone {
  constructor(id, key) {
    this.id = id;
    this.tracker = {
      time: 0,
      speed: 0,
      moving: false,
      max: 0,
      anchor: null,
    };
  }

  get speed() {
    return this.tracker.speed;
  }

  get moving() {
    return this.tracker.moving;
  }

  update(location) {
    let distance;
    let duration;
    const tracker = this.tracker;
    const time = Date.now();

    if (tracker.time) {
      duration = time - tracker.time;

      // check that drone is moving
      if (duration > 10000) {
        tracker.time = time;
        tracker.anchor = location;
        tracker.moving = tracker.max > 1;
        tracker.max = 0;
      }
    } else {
      tracker.time = time;
      tracker.anchor = location;
    }

    distance = calcDistance(tracker.anchor, location);
    tracker.speed = calcSpeed(tracker, distance, time);

    if (distance > tracker.max) {
      tracker.max = distance;
    }
  }

  strip() {
    const {
      id,
      speed,
      moving,
    } = this;

    return { id, speed, moving };
  }

  stringify() {
    return JSON.stringify(this.strip());
  }
}

module.exports = Drone;
