import * as PIXI from 'pixi.js';
import ECS from 'yagl-ecs';
import Sprite from 'components/Sprite.js';
import globals from 'globals';
import spawner from 'components/Spawner';
import gridPosition from 'components/GridPosition';
import * as actions from 'button-actions';
import constructionMenuEntity from 'entities/constructionMenu';
import PixiVector from 'PixiVector';
import spriteEntity from 'entities/spriteEntity';
import { buttonMuteEntity, infoPanelEntity, speedUpEntity, showRangesEntity } from 'entities/ui';

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

let constructionMenu, buttonShowRanges;

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

  buttonShowRanges = showRangesEntity(globals.width - 150, 300);
  globals.showRange = buttonShowRanges.components.sprite.pixiSprite.children[0].visible;
  entities.push(buttonShowRanges);

  return entities;
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
