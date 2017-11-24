import * as PIXI from 'pixi.js';
import globals from 'globals';
import ECS from 'yagl-ecs';
import * as actions from 'button-actions';

export default class Construction extends ECS.System {
  test(entity) {
    return !!entity.components.menuTower;
  }

  update(entity) {
    if (entity.components.purchased.cost > globals.player.gold) {
      entity.components.systemlessSprite.pixiSprite.alpha = 0.5;
    }
  }
}
