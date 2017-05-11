import * as PIXI from 'pixi.js';
import ECS from 'yagl-ecs';

export default class Render extends ECS.System {
  constructor (renderer, width, height, stage) {
    super();

    this.renderer = renderer;
    this.width = width;
    this.height = height;
    this.stage = stage;

  }

  test (entity) {
    return entity.components.sprite &&
      entity.components.sprite.pixiSprite;
  }

  enter (entity) {
    this.stage.addChild(entity.components.sprite.pixiSprite);
  }

  exit (entity) {
    this.stage.removeChild(entity.components.sprite.pixiSprite);
  }

  update (entity) {
    this.renderer.render(this.stage);
  }

}
