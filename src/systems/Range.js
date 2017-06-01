import * as PIXI from 'pixi.js';
import ECS from 'yagl-ecs';
import { hasSprite } from 'components/Sprite';

export default class Range extends ECS.System {
  test (entity) {
    return hasSprite(entity) && entity.components.range;
  }

  update (entity) {
    let {pixiSprite} = entity.components.sprite;
    let graphics = new PIXI.Graphics();

    graphics.lineStyle(3, 0xFF0000, 1);
    graphics.drawCircle(pixiSprite.position.x, pixiSprite.position.y, entity.components.range.range);
    graphics.endFill();
  }
}
