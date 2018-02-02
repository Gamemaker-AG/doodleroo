import * as PIXI from 'pixi.js';
import ECS from 'yagl-ecs';
import globals from 'globals';
import Sprite from 'components/Sprite.js';
import { hasSprite } from 'components/Sprite';
import * as actions from 'button-actions';
import ZIndex from 'components/ZIndex';

export default class Range extends ECS.System {
  constructor (ecs) {
    super();

    this.ecs = ecs;
  }

  test (entity) {
    return hasSprite(entity) && entity.components.range;
  }

  enter (entity) {
    let { range } = entity.components;
    let { pixiSprite } = entity.components.sprite;
    let rangeEntity = new ECS.Entity(null, [Sprite, ZIndex]);

    let rangeIndicator = new PIXI.Graphics();
    rangeIndicator.beginFill(range.color, 0.1);
    rangeIndicator.drawCircle(pixiSprite.x, pixiSprite.y, range.range * globals.slotSize);
    rangeIndicator.endFill();

    rangeEntity.components.sprite.pixiSprite = rangeIndicator;
    rangeEntity.components.zIndex.index = 1;

    this.ecs.addEntity(rangeEntity);
    range.entity = rangeEntity;

    range.isVisible = globals.showRange;
  }

  exit (entity) {
    this.ecs.removeEntity(entity.components.range.entity);
  }

  update (entity) {
    entity.components.range.entity.components.sprite.pixiSprite.alpha = (entity.components.range.isVisible ? 1 : 0);
  }

  [ actions.TOGGLE_SHOW_RANGES_SINGLE ] (entity, button) {
    if (!globals.showRange) {
      entity.components.range.isVisible = !entity.components.range.isVisible;
    }
  }
}
