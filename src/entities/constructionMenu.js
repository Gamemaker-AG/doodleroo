import ECS from 'yagl-ecs';
import Sprite from 'components/Sprite.js';
import GridPosition from 'components/GridPosition';
import PixiVector from 'PixiVector';
import globals from 'globals';
import { tower_types } from 'entities/towers';
import ZIndex from 'components/ZIndex';
import * as actions from 'button-actions';

export default function constructionMenuEntity (addEntity) {
  let entity = new ECS.Entity(null, [Sprite, GridPosition, ZIndex]);
  entity.components.zIndex.index = globals.zIndexes - 1;
  entity.components.sprite.pixiSprite = new PIXI.Sprite(PIXI.loader.resources['circular_background'].texture);
  entity.addComponent('button', {
    actions: {
      'click': [actions.TOGGLE_TOWER_MENU, entity, entity.components.sprite.pixiSprite.position, entity.components.gridPosition, addEntity]
    }
  });

  let { pixiSprite } = entity.components.sprite;
  pixiSprite.visible = false;
  pixiSprite.anchor.set(0.5, 0.5);
  pixiSprite.position.set(0, 0);
  pixiSprite.scale.set(0.7);
  pixiSprite.alpha = 0.5;
  pixiSprite.interactive = true;

  return entity;
};
