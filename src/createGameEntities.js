import ECS from 'yagl-ecs';
import Sprite from 'components/Sprite.js';
import globals from 'globals';
import Button from 'components/Button';
import * as actions from 'button-actions';
import Vector from 'vigur';

const slotSize = globals.height / gridSize;

export default function createGameEntities () {
  let towers = [
    [100, 100, 'tower_weak'],
    [100, 300, 'tower_strong'],
    [100, 500, 'tower_long']
  ];

  let entities = towers.map(specs => towerEntity(specs));

  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      entities.push(slotEntity(x, y));
    }
  }

  return entities;
}

function towerEntity (specs) {
  let entity = spriteEntity(...specs);
  entity.components.sprite.pixiSprite.anchor.set(0.5, 0.5);
  entity.addComponent('range', {range: 210, visibility: true, color: 0xFF0000});
  entity.addComponent('movement', {
    velocity: new Vector(0, 1),
    angularVelocity: 0.1
  });
  return entity;
}

function slotEntity (x, y) {
  let entity = spriteEntity(slotSize / 2 + x * slotSize, slotSize / 2 + y * slotSize, 'slot');
  entity.components.sprite.pixiSprite.anchor.set(0.5, 0.5);
  entity.addComponent('button', { action: () => {
    console.log('This should open some purchase menu.');
  }});
  return entity;
}

function spriteEntity (x, y, img_name) {
  let entity = new ECS.Entity(null, [Sprite]);
  let sprite = entity.components.sprite;
  sprite.pixiSprite = new PIXI.Sprite(PIXI.loader.resources[img_name].texture);
  sprite.pixiSprite.position.set(x, y);
  return entity;
}
