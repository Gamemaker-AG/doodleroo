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
    let text_gold = childAt(entity, 0).text;
    let text_lives = childAt(entity, 1).text;

    if (text_gold.substring(1, text_gold.length) != globals.player.gold) {
      childAt(entity, 0).text = '$' + globals.player.gold;
    }

    if (text_lives.substring(17, text_lives.length) != globals.player.lives) {
      childAt(entity, 1).text = 'Remaining lives: ' + globals.player.lives;
    }
  }
};

function childAt (entity, pos) {
  return entity.components.sprite.pixiSprite.getChildAt(pos);
}
