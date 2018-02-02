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

  collect (entity) {
    return {
      spawners: !!entity.components.spawner
    };
  }

  update (entity) {
    let text_gold = childAt(entity, 0).text;
    let text_lifes = childAt(entity, 1).text;
    let text_score = childAt(entity, 2).text;

    if (text_gold != globals.player.gold) {
      childAt(entity, 0).text = globals.player.gold.toString();
    }

    if (text_lifes != globals.player.lifes) {
      childAt(entity, 1).text = globals.player.lifes.toString();
    }

    if (text_score != globals.player.score) {
      childAt(entity, 2).text = globals.player.score.toString();
    }

    let spawner = this.collections.spawners[0].components.spawner;
    let { creepInfoPanel: panel } = entity.components;
    let timeToWave = spawner.waveDelay - (spawner.timeSinceWave);
    childAt(entity, 3).text = `time to next wave: ${timeToWave.toPrecision(2)}s`;
  }
};

function childAt (entity, pos) {
  return entity.components.sprite.pixiSprite.getChildAt(pos);
}
