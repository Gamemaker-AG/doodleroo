import Vector from 'vigur';

export default {
  name: 'movement',
  defaults: {
    velocity: new Vector(0, 0),
    angularVelocity: 0,
    maxSpeed: 100,
    speedFactor: 1, // 0.5: half speed, 2: double speed
    slowDuration: 0
  }
};
