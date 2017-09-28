import PixiVector from 'PixiVector';
import spriteEntity from 'entities/spriteEntity';
import globals from 'globals';

const defaults = {
  timeSinceSpawn: 0,
  enemyImageName: 'tower_strong',
  enemyComponents: (x, y) => {
    return {
    };
  },
  count: 0,
  interval: 1
}

export default function baseCreep (x, y, difficulty) {
  let vec = new PixiVector(x, y).toWorld();
  let entity = spriteEntity(vec.x, vec.y, 'tower_weak');
  entity.components.sprite.pixiSprite.anchor.set(0.5, 0.5);
  entity.addComponent('movement',{
      velocity: new PixiVector(0, 0),
      angularVelocity: 0,
      maxSpeed: 100,
      speedFactor: 1, // 0.5: half speed, 2: double speed
      slowDuration: 0
  });
  entity.addComponent('enemy', {});
  entity.addComponent('gridPosition', {x, y});
  entity.addComponent('health', {health: 100});
  entity.addComponent('followPath', {});
  entity.addComponent('goal', {x: Math.floor(globals.slotCount / 2), y: globals.slotCount - 1});
  entity.addComponent('autoUpdateGridPosition', {});
  entity.addComponent('spawned');
  for (let [name, value] of Object.entries(defaults.enemyComponents(x, y))) {
    entity.addComponent(name, value);
  }
  return entity;
}
