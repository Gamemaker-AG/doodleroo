import * as PIXI from 'pixi.js';
import ECS from 'yagl-ecs';

const WIDTH = 1280;
const HEIGHT = 720;

export default class Render extends ECS.System {
  constructor () {
    super();

    document.body.style.margin = '0';

    this.renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT, {
      resolution: window.devicePixelRatio || 1
    });
    this.renderer.backgroundColor = 0xFFFFFF;
    // this.renderer.view.style.border = '1px solid black'
    document.body.appendChild(this.renderer.view);

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
      window.innerWidth / WIDTH,
      window.innerHeight / HEIGHT
    );

    const newWidth = Math.ceil(WIDTH * scaleFactor);
    const newHeight = Math.ceil(HEIGHT * scaleFactor);

    this.renderer.view.style.width = `${newWidth}px`;
    this.renderer.view.style.height = `${newHeight}px`;

    this.renderer.resize(newWidth, newHeight);
    this.stage.scale.set(scaleFactor);
  }

};
