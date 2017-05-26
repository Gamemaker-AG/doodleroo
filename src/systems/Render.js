import * as PIXI from 'pixi.js';
import ECS from 'yagl-ecs';

export default class Render extends ECS.System {
  constructor (renderer, stage, width, height) {
    super();

    this.renderer = renderer;
    this.width = width;
    this.height = height;
    this.stage = stage;

    window.addEventListener('resize', this.resizeHandler.bind(this), false);
    this.resizeHandler();
  }

  test (entity) {
    return entity.components.sprite &&
      entity.components.sprite.pixiSprite;
  }

  enter (entity) {
    this.stage.addChild(entity.components.sprite.pixiSprite);

    if (entity.components.range) {
      entity.rangeIndicator = new PIXI.Graphics();
      let {pixiSprite} = entity.components.sprite;

      entity.rangeIndicator.lineStyle(3, entity.components.range.color, entity.components.range.visibility);
      entity.rangeIndicator.drawCircle(0, 0, entity.components.range.range);
      entity.rangeIndicator.endFill();
      entity.rangeIndicator.position.set(pixiSprite.position.x, pixiSprite.position.y);

      this.stage.addChild(entity.rangeIndicator);
    }
  }

  exit (entity) {
    this.stage.removeChild(entity.components.sprite.pixiSprite);
  }

  update (entity) {
    if (entity.components.range) {
      let {pixiSprite} = entity.components.sprite;

      entity.rangeIndicator.alpha = 1;

      let offsetRange = entity.components.range.range / 2;
      entity.rangeIndicator.position.set(pixiSprite.position.x, pixiSprite.position.y);
    }
  }

  resizeHandler () {
    console.log('innerWidth', window.innerWidth);
    console.log('innerHeight', window.innerHeight);

    const scaleFactor = Math.min(
      window.innerWidth / this.width,
      window.innerHeight / this.height
    );

    const newWidth = Math.ceil(this.width * scaleFactor);
    const newHeight = Math.ceil(this.height * scaleFactor);

    this.renderer.view.style.width = `${newWidth}px`;
    this.renderer.view.style.height = `${newHeight}px`;

    this.renderer.resize(newWidth, newHeight);
    this.stage.scale.set(scaleFactor);
  }

};
