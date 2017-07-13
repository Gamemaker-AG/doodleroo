import * as PIXI from 'pixi.js';
import ECS from 'yagl-ecs';
import { hasSprite } from 'components/Sprite';
import globals from 'globals';

export default class InfoPanel extends ECS.System {
  constructor () {
    super();
  }

  test (entity) {
    return hasSprite(entity) && entity.components.infoPanelUpdater;
  }

  update (entity) {
    if (entity.components.sprite.pixiSprite.text != globals.player.gold) {
      entity.components.sprite.pixiSprite.text = globals.player.gold;
    }
  }
};
