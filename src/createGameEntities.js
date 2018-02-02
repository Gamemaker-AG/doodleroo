import ECS from 'yagl-ecs';
import globals from 'globals';
import spawner from 'components/Spawner';
import gridPosition from 'components/GridPosition';
import * as actions from 'button-actions';
import constructionMenuEntity from 'entities/constructionMenu';
import PixiVector from 'PixiVector';
import spriteEntity from 'entities/spriteEntity';
import { buttonMuteEntity, infoPanelEntity, speedUpEntity, showRangesEntity } from 'entities/ui';

const {slotCount, slotSize} = globals;

let constructionMenu, buttonShowRanges, addEntity, removeEntity;

export default function createGameEntities (_addEntity, _removeEntity, backgroundMusic) {
  addEntity = _addEntity;
  removeEntity = _removeEntity;
  let entities = [];

  constructionMenu = constructionMenuEntity(addEntity);
  for (let x = 0; x < slotCount; x++) {
    for (let y = 0; y < slotCount; y++) {
      entities.push(slotEntity(x, y, false, 'slot'));

      if (y === 0 && (x === Math.floor(slotCount / 2) || x === Math.ceil(slotCount / 2) - 1)) {
        entities.push(slotEntity(x, y, false, 'start'));
      } else if (y === slotCount - 1 && (x === Math.floor(slotCount / 2) || x === Math.ceil(slotCount / 2) - 1)) {
        entities.push(slotEntity(x, y, false, 'goal'));
      } else if ((x === 0 || x === slotCount - 1) || (y === 0 || y === slotCount - 1)) {
        let entity = slotEntity(x, y, false, 'wall');
        entity.addComponent('obstacle', {cost: Infinity});
        entity.addComponent('gridPosition', {x: x, y: y});
        entities.push(entity);
      } else {
        entities.push(slotEntity(x, y, true, 'slot'));
      }
    }
  }

  let entity = new ECS.Entity(null, [spawner, gridPosition]);
  entity.components.gridPosition = {x: slotCount / 2, y: 0};
  entities.push(entity);

  entities.push(constructionMenu);
  entities.push(infoPanelEntity(globals.width - 200, 100));
  entities.push(buttonMuteEntity(globals.width - 100, 100, backgroundMusic));
  entities.push(speedUpEntity(globals.width - 100, 200));

  buttonShowRanges = showRangesEntity(globals.width - 100, 300);
  globals.showRange = buttonShowRanges.components.sprite.pixiSprite.children[0].visible;
  entities.push(buttonShowRanges);

  return entities;
};

function randomElement (arr) {
  let randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

function slotEntity (x, y, clickable = true , style = 'slot') {
  let worldPos = new PixiVector(x, y)
    .multiply(slotSize)
    .add(slotSize / 2)
    .add(globals.gridOffset);
  let entity = spriteEntity(worldPos.x, worldPos.y, style);
  let {pixiSprite} = entity.components.sprite;

  pixiSprite.rotation = randomElement([Math.PI / 2, -Math.PI / 2, 0, Math.PI]);
  pixiSprite.anchor.set(0.5, 0.5);
  pixiSprite.scale.set(slotSize / pixiSprite.texture.height);

  if (clickable) {
    entity.addComponent('button', {
      actions: {
        'click': [actions.TOGGLE_TOWER_MENU, constructionMenu, worldPos, new PixiVector(x, y), addEntity, removeEntity]
      }
    });
  }

  entity.addComponent('zIndex', {index: 0});

  return entity;
}
