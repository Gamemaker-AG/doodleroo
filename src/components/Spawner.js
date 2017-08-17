import Vector from 'vigur';
import PixiVector from 'PixiVector';

export default {
  name: 'spawner',
  defaults: {
    timeSinceSpawn: 0,
    enemyImageName: 'tower_strong',
    enemyComponents: {
      'enemy': {},
      'gridPosition': {x: 0, y: 0},
      'movement': {
        velocity: new PixiVector(0, 0),
        angularVelocity: 0,
        maxSpeed: 50
      },
      'goal': {x: 7, y: 13},
      'autoUpdateGridPosition': {},
      'followPath': {}
    },
    count: 0,
    interval: 1
  }
};
