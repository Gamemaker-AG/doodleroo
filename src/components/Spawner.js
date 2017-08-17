import Vector from 'vigur';
import PixiVector from 'PixiVector';
import globals from 'globals';

const { slotCount } = globals;

export default {
  name: 'spawner',
  defaults: {
    timeSinceSpawn: 0,
    enemyImageName: 'tower_strong',
    enemyComponents: () => {
      return {
      'enemy': {},
      'gridPosition': {x: 0, y: 0},
      'movement': {
        velocity: new PixiVector(0, 0),
        angularVelocity: 0,
        maxSpeed: 50
      },
      'goal': {x: Math.floor(slotCount / 2), y: slotCount - 1},
      'autoUpdateGridPosition': {},
      'followPath': {}
      }
    },
    count: 0,
    interval: 1
  }
};
