import * as PIXI from 'pixi.js';
import ECS from 'yagl-ecs';
import globals from 'globals';

function toWorldCoords (gridPosition) {
  return {
    x: gridPosition.x * globals.slotSize + globals.gridOffset,
    y: gridPosition.y * globals.slotSize + globals.gridOffset
  };
}

export default class Render extends ECS.System {
  constructor (renderer, stage, width, height) {
    super();

    this.renderer = renderer;
    this.width = width;
    this.height = height;
    this.stage = stage;
    this.pathIndicators = {}

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

  drawDebugPath (entity) {
    entity.components.goalPath.pathUpdated = false;
    if (this.pathIndicators[entity.id] === undefined) {
      this.pathIndicators[entity.id] = new PIXI.Graphics();
    }
    let pathIndicator = this.pathIndicators[entity.id]
    pathIndicator.clear();
    pathIndicator.lineStyle(
      10,
      0xDDDD00,
      0.5
    );
    let first = true;
    pathIndicator.moveTo(0, 0);
    for (let pos of entity.components.goalPath.path) {
      let {x, y} = toWorldCoords({x: pos[0], y: pos[1]});
      if (first) {
        pathIndicator.moveTo(x + globals.slotSize / 2, y + globals.slotSize / 2);
        first = false;
      } else {
        pathIndicator.lineTo(x + globals.slotSize / 2, y + globals.slotSize / 2);
      }
    }
    this.stage.addChild(pathIndicator);
  }

  preUpdate () {
    for (let indicator of Object.values(this.pathIndicators)) {
      indicator.clear();
    }
  }

  update (entity) {
    let {components: cs} = entity;
    if (cs.goalPath) {
      this.drawDebugPath(entity);
    }
  }

  resizeHandler () {
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
