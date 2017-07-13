import ECS from 'yagl-ecs';
import Sprite from 'components/Sprite.js';
import globals from 'globals';
import Button from 'components/Button';
import GridPosition from 'components/GridPosition';
import * as actions from 'button-actions';
import constructionMenuEntity from 'entities/constructionMenu';
import PixiVector from 'PixiVector';

const {slotCount, slotSize} = globals;

const towers = [
  {
    img: 'tower_weak',
    cost: 100,
    range: 180
  },
  {
    img: 'tower_strong',
    cost: 200,
    range: 200
  },
  {
    img: 'tower_long',
    cost: 300,
    range: 300
  }
];

let constructionMenu;

const enemies = [
  [100, 100, 'tower_weak']
];

export default function createGameEntities (addEntity) {
  let entities = [];

  constructionMenu = constructionMenuEntity(addEntity, towers);

  for (let x = 0; x < slotCount; x++) {
    for (let y = 0; y < slotCount; y++) {
      entities.push(slotEntity(x, y));
    }
  }

  entities = entities.concat(enemies.map(specs => enemyEntity(specs)));
  entities.push(constructionMenu);

  return entities;
};

function enemyEntity (specs) {
  let entity = spriteEntity(...specs);
  entity.components.sprite.pixiSprite.anchor.set(0.5, 0.5);
  entity.addComponent('gridPosition', {x: 1, y: 1});
  entity.addComponent('enemy');
  return entity;
}

export function towerEntity (x, y, specs) {
  globals.player.gold -= specs[3];
  let entity = spriteEntity(...specs);
  let {pixiSprite} = entity.components.sprite;
  pixiSprite.anchor.set(0.5, 0.5);
  pixiSprite.scale.set(slotSize / pixiSprite.texture.height);
  entity.addComponent('range', {range: specs[4], color: 0xFF0000});
  entity.addComponent('obstacle', {cost: Infinity});
  entity.addComponent('gridPosition', {x: x, y: y});
  entity.addComponent('button', {
    actions: {
      'mouseover': actions.TOGGLE_SHOW_RANGES,
      'mouseout': actions.TOGGLE_SHOW_RANGES
    }
  });
  return entity;
};

function slotEntity (x, y) {
  let worldPos = new PixiVector(x, y)
    .multiply(slotSize)
    .add(slotSize / 2)
    .add(globals.gridOffset);
  let entity = spriteEntity(worldPos.x, worldPos.y, 'slot');
  let {pixiSprite} = entity.components.sprite;
  pixiSprite.anchor.set(0.5, 0.5);
  pixiSprite.scale.set(slotSize / pixiSprite.texture.height);

  entity.addComponent('button', {
    actions: {
      'click': [actions.TOGGLE_TOWER_MENU, constructionMenu, worldPos, new PixiVector(x, y)]
    }
  });

  return entity;
}

function spriteEntity (x, y, img_name) {
  let entity = new ECS.Entity(null, [Sprite]);
  let sprite = entity.components.sprite;
  sprite.pixiSprite = new PIXI.Sprite(PIXI.loader.resources[img_name].texture);
  sprite.pixiSprite.position.set(x, y);
  return entity;
}
