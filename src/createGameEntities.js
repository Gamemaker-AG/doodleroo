import * as PIXI from 'pixi.js';
import ECS from 'yagl-ecs';
import Sprite from 'components/Sprite.js';
import globals from 'globals';
import spawner from 'components/Spawner';
import gridPosition from 'components/GridPosition';
import * as actions from 'button-actions';
import constructionMenuEntity from 'entities/constructionMenu';
import PixiVector from 'PixiVector';
import { buttonMuteEntity, infoPanelEntity, speedUpEntity } from 'entities/ui';

const {slotCount, slotSize} = globals;

const towers = [
  {
    img: 'tower_weak',
    cost: 100,
    range: 1.8,
    damage: 30
  },
  {
    img: 'tower_strong',
    cost: 200,
    range: 2,
    damage: 100
  },
  {
    img: 'tower_long',
    cost: 300,
    range: 3,
    damage: 50
  }
];

let constructionMenu;

export default function createGameEntities (addEntity) {
  let entities = [];

  constructionMenu = constructionMenuEntity(addEntity, towers);
  let clickable;
  let style;
  for (let x = 0; x < slotCount; x++) {
    for (let y = 0; y < slotCount; y++) {
      if ((x === 0 || x === slotCount - 1) || (y === 0 || y === slotCount - 1)) {
        clickable = false;
        style = 'wall';
      } else {
        clickable = true;
        style = 'slot';
      }
      if (y === slotCount - 1 && (x === Math.floor(slotCount / 2) || x === Math.ceil(slotCount / 2) - 1)) {
        style = 'goal';
      }
      entities.push(slotEntity(x, y, clickable, style));
    }
  }

  let entity = new ECS.Entity(null, [spawner, gridPosition]);
  entity.components.gridPosition = {x: 3, y: 3};
  entities.push(entity);

  entities.push(constructionMenu);
  entities.push(infoPanelEntity(globals.width - 200, 100));
  entities.push(buttonMuteEntity(globals.width - 150, 100));
  entities.push(speedUpEntity(globals.width - 150, 200));

  return entities;
};

export function towerEntity (x, y, specs) {
  globals.player.gold -= specs[3];
  let entity = spriteEntity(...specs);
  let {pixiSprite} = entity.components.sprite;
  pixiSprite.anchor.set(0.5, 0.5);
  pixiSprite.scale.set(slotSize / pixiSprite.texture.height);

  if (specs[2] === 'tower_weak') {
    let rotatable = new PIXI.Sprite(PIXI.loader.resources['tower_weak_top'].texture);
    rotatable.anchor.set(0.5, 0.5);
    rotatable.scale.set(pixiSprite.scale.x);
    pixiSprite.addChild(rotatable);
  }

  if (specs[2] === 'tower_long') {
    entity.addComponent('slow', {rate: 0.5, timeSinceLastSlow: 0, speedFactor: 0.5, duration: 0.8});
  }

  entity.addComponent('range', {range: specs[4], color: 0xFF0000});
  entity.addComponent('obstacle', {cost: 2000});
  entity.addComponent('gridPosition', {x: x, y: y});
  if (specs[2] !== 'tower_long') {
    entity.addComponent('attack', {rate: 0.5, timeSinceLastAttack: 0, damage: specs[5]});
  }
  entity.addComponent('button', {
    actions: {
      'mouseover': actions.TOGGLE_SHOW_RANGES,
      'mouseout': actions.TOGGLE_SHOW_RANGES
    }
  });
  return entity;
};

function slotEntity (x, y, clickable = true , style = 'slot') {
  let worldPos = new PixiVector(x, y)
    .multiply(slotSize)
    .add(slotSize / 2)
    .add(globals.gridOffset);
  let entity = spriteEntity(worldPos.x, worldPos.y, style);
  let {pixiSprite} = entity.components.sprite;
  pixiSprite.anchor.set(0.5, 0.5);
  pixiSprite.scale.set(slotSize / pixiSprite.texture.height);

  if (clickable) {
    entity.addComponent('button', {
      actions: {
        'click': [actions.TOGGLE_TOWER_MENU, constructionMenu, worldPos, new PixiVector(x, y)]
      }
    });
  }

  return entity;
}

export function spriteEntity (x, y, imgName) {
  let entity = new ECS.Entity(null, [Sprite]);
  let sprite = entity.components.sprite;
  sprite.pixiSprite = new PIXI.Sprite(PIXI.loader.resources[imgName].texture);
  sprite.pixiSprite.position.set(x, y);
  return entity;
};
