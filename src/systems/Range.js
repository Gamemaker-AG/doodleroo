import * as PIXI from 'pixi.js';
import ECS from 'yagl-ecs';
import globals from 'globals';
import { hasSprite } from 'components/Sprite';
import * as actions from 'button-actions';

export default class Range extends ECS.System {
  constructor (stage) {
    super();

    this.stage = stage;
  }

  test (entity) {
    return hasSprite(entity) && entity.components.range;
  }

  enter (entity) {
    if (entity.components.range) {
      let {range} = entity.components;
      range.indicator = new PIXI.Graphics();
      let {pixiSprite} = entity.components.sprite;

      range.indicator.beginFill(1, 0.1);
      range.indicator.lineStyle(3, range.color, 1);
      range.indicator.drawCircle(0, 0, range.range * globals.slotSize);
      range.indicator.endFill();
      range.indicator.position.set(pixiSprite.position.x, pixiSprite.position.y);

      this.stage.addChild(range.indicator);

      range.isVisible = globals.showRange;
    }
  }

  exit (entity) {
    this.stage.removeChild(entity.components.range.indicator);
  }

  update (entity) {
    entity.components.range.indicator.alpha = (entity.components.range.isVisible ? 1 : 0);
  }

  [ actions.TOGGLE_SHOW_RANGES_SINGLE ] (entity, button) {
    if (!globals.showRange) {
      entity.components.range.isVisible = !entity.components.range.isVisible;
    }
  }
};
