import ECS from 'yagl-ecs';
import Sprite from 'components/Sprite.js';
import globals from 'globals';
import spawner from 'components/Spawner';
import Button from 'components/Button';
import gridPosition from 'components/GridPosition';
import * as actions from 'button-actions';
import constructionMenuEntity from 'entities/constructionMenu';
import PixiVector from 'PixiVector';
import { spriteEntity } from 'UIEntities';
import { buttonMuteEntity } from 'UIEntities';
import { infoPanelEntity } from 'UIEntities';

const {slotCount, slotSize} = globals;

const towers = [
  {
    img: 'tower_weak',
    cost: 100,
    range: 180,
    damage: 30
  },
  {
    img: 'tower_strong',
    cost: 200,
    range: 200,
    damage: 100
  },
  {
    img: 'tower_long',
    cost: 300,
    range: 300,
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
      if (y === slotCount - 1 && (x == Math.floor(slotCount / 2) || x == Math.ceil(slotCount / 2) - 1)) {
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

  return entities;
};

function enemyEntity (specs) {
  let entity = spriteEntity(...specs);
  entity.components.sprite.pixiSprite.anchor.set(0.5, 0.5);
  entity.addComponent('gridPosition', {x: 1, y: 10});
  entity.addComponent('movement', {velocity: new PixiVector(0, 0), angularVelocity: 0, maxSpeed: 50});
  entity.addComponent('enemy', {});
  entity.addComponent('autoUpdateGridPosition', {});
  entity.addComponent('followPath', {});
  entity.addComponent('goal', {x: 12, y: 12});
  return entity;
}

export function towerEntity (x, y, specs) {
  globals.player.gold -= specs[3];
  let entity = spriteEntity(...specs);
  let {pixiSprite} = entity.components.sprite;
  pixiSprite.anchor.set(0.5, 0.5);
  pixiSprite.scale.set(slotSize / pixiSprite.texture.height);
  entity.addComponent('range', {range: specs[4], color: 0xFF0000});
  entity.addComponent('obstacle', {cost: 2000});
  entity.addComponent('gridPosition', {x: x, y: y});
  entity.addComponent('attack', {rate: 0.5, timeSinceLastAttack: 0, damage: specs[5]});
  entity.addComponent('button', {
    actions: {
      'mouseover': actions.TOGGLE_SHOW_RANGES,
      'mouseout': actions.TOGGLE_SHOW_RANGES
    }
  });
  return entity;
};

function slotEntity (x, y, clickable = true, style = 'slot') {
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

export function spriteEntity (x, y, img_name) {
  let entity = new ECS.Entity(null, [Sprite]);
  let sprite = entity.components.sprite;
  sprite.pixiSprite = new PIXI.Sprite(PIXI.loader.resources[img_name].texture);
  sprite.pixiSprite.position.set(x, y);
  return entity;
}

function infoPanelEntity (x, y) {
  let entity = new ECS.Entity(null, [Sprite]);
  entity.components.sprite.pixiSprite = new PIXI.Container();
  entity.components.sprite.pixiSprite.position.set(globals.width - 800, 100);

  let style = {fontFamily: 'Arial', fontSize: 50, fill: 0xFF0000, align: 'center'};

  let gold = new PIXI.Text('$' + globals.player.gold, style);
  gold.position.set(0, 0);
  entity.components.sprite.pixiSprite.addChild(gold);

  let lifes = new PIXI.Text('Remaining lifes: ' + globals.player.lifes, style);
  lifes.position.set(0, 100);
  entity.components.sprite.pixiSprite.addChild(lifes);

  entity.addComponent('infoPanelUpdater');

  return entity;
}
