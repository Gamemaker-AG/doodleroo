import ECS from 'yagl-ecs';
import Sprite from 'components/Sprite.js';
import globals from 'globals';
import Button from 'components/Button';
import * as actions from 'button-actions';
import Vector from 'vigur';

const gridSize = 16;
const slotSize = globals.height / gridSize;

export default function createGameEntities () {
  let towers = [
    [100, 100, 'tower_weak'],
    [100, 300, 'tower_strong'],
    [100, 500, 'tower_long']
  ];

  let entities = towers.map(specs => spriteEntity(...specs));
  entities.map((e) => {
    e.components.sprite.pixiSprite.anchor.set(0.5, 0.5);
    e.addComponent('range', {range: 50, visibility: 1, color: 0xFF0000});
    e.addComponent('movement', {
      velocity: new Vector(0, 0),
      angularVelocity: 0 // 0.3
    });
  });

  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      let e = slotEntity(x, y);
      e.addComponent('button', { action: () => {
          console.log('This should open some purchase menu.');
      }});
      entities.push(e);
    }
  }

  return entities;
};

function slotEntity (x, y) {
  return spriteEntity(x * slotSize, y * slotSize, 'slot');
}

function spriteEntity (x, y, img_name) {
  let entity = new ECS.Entity(null, [Sprite]);
  let sprite = entity.components.sprite;
  sprite.pixiSprite = new PIXI.Sprite(PIXI.loader.resources[img_name].texture);
  sprite.pixiSprite.position.set(x, y);
  return entity;
}
