import * as PIXI from 'pixi.js';
import ECS from 'yagl-ecs';

export default class Render extends ECS.System {
  constructor (renderer, width, height) {
    super();

    this.renderer = renderer;
    this.width = width;
    this.height = height;
    this.stage = new PIXI.Container();

    window.addEventListener('resize', this.resizeHandler.bind(this), false);
    this.resizeHandler();
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

}
