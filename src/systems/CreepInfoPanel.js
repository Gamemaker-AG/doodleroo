import * as PIXI from 'pixi.js';
import ECS from 'yagl-ecs';
import { hasSprite } from 'components/Sprite';
import globals from 'globals';
import { childAt } from 'utils';

export default class CreepInfoPanel extends ECS.System {
  constructor (spawner) {
    super();
    this.spawner = spawner
  }

  collect (entity) {
    console.log("Collecting");
    if (entity.components.spawner) {
      return "spawners"
    }
  }

  test (entity) {
    return hasSprite(entity) && entity.components.creepInfoPanel;
  }

  update (entity) {
    let spawner = this.spawner;
    let { creepInfoPanel: panel } = entity.components;
    // let timeToWave = spawner.waveDelay - (spawner.timerSinceWave || 0);
    // let wave_ui = childAt(entity, 0);
    // wave_ui.text = `time to next wave ${timeToWave}`;
    // console.log(`time to next wave ${timeToWave}`);
  }
};
