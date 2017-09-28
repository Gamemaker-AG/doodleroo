const defaults = {
  timeSinceSpawn: 0,
  enemyImageName: 'tower_strong',
  enemyComponents: (x, y) => {
    return {
      'enemy': {},
      'gridPosition': {x, y},
      'movement': {
        velocity: new PixiVector(0, 0),
        angularVelocity: 0,
        maxSpeed: 100,
        speedFactor: 1, // 0.5: half speed, 2: double speed
        slowDuration: 0
      },
      'goal': {x: Math.floor(slotCount / 2), y: slotCount - 1},
      'autoUpdateGridPosition': {},
      'followPath': {},
      'health': {health: 50}
    };
  },
  count: 0,
  interval: 1
}

export default function baseCreep (difficulty) {

}
