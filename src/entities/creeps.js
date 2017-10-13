import PixiVector from 'PixiVector';
import globals from 'globals';
import spriteEntity from 'entities/spriteEntity';

import Attack from '../components/Attack';

const creep_types = [
  {cost: 100, factory: baseCreep},
  {cost: 200, factory: tankCreep},
  {cost: 300, factory: speedCreep}
]

export default function randomCreeps (x, y, difficulty) {
  let creeps = [];
  let remaining_difficulty = difficulty;
  let can_afford = []
  do {
    can_afford = creep_types.filter(creep =>  creep.cost <= remaining_difficulty);
    if (can_afford.length > 0) {
      let { cost, factory } = can_afford[Math.floor(Math.random() * can_afford.length)];
      creeps.push(factory(x, y));
      remaining_difficulty -= cost;
    }
  }
  while (can_afford.length > 0);
  return creeps;
}

export function baseCreep (x, y) {
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
  entity.addComponent('health', {health: 100, initialHealth: 100});
  entity.addComponent('followPath', {});
  entity.addComponent('goal', {x: Math.floor(globals.slotCount / 2), y: globals.slotCount - 1});
  entity.addComponent('autoUpdateGridPosition', {});
  entity.addComponent('spawned');
  entity.addComponent('opacity', {alpha: 1});
  entity.addComponent('attack', {
    rate: 1,
    timeSinceLastAttack: 0,
    damage: 10
  });
  return entity;
}


export function tankCreep (x, y) {
  let entity = baseCreep(x, y);
  entity.components.health.health *= 5;
  entity.components.health.initialHealth *= 5;
  entity.components.movement.maxSpeed *= 0.75;
  return entity;
}

export function speedCreep (x, y) {
  let entity = baseCreep(x, y);
  entity.components.movement.maxSpeed *= 1.5;
  return entity;
}
