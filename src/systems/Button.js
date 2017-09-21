import * as PIXI from 'pixi.js';
import ECS from 'yagl-ecs';
import { hasSprite } from 'components/Sprite';
import * as actions from 'button-actions';

export default class Button extends ECS.System {
  constructor (rangeSystem) {
    super();
    this.rangeSystem = rangeSystem;
  }

  test (entity) {
    return hasSprite(entity) && entity.components.button;
  }

  enter (entity) {
    entity.components.sprite.pixiSprite.interactive = true;
    let {actions} = entity.components.button;
    for (let name of Object.keys(actions)) {
      let action = actions[name];
      if (action instanceof Function) {
        entity.components.sprite.pixiSprite.click = action;
      } else if (action !== null) {
        let args = [];
        if (action instanceof Array) { [action, ...args] = action;
        }

        entity.components.sprite.pixiSprite[name] = () => {
          for (let system of entity.systems) {
            if (system[action] instanceof Function) {
              system[action](...args);
            }
          }
        };
      }
    }
  }

  exit (entity) {
    entity.components.button.click = undefined;
  }

  [ actions.TOGGLE_SHOW_RANGES_ALL ] (sprite) {
    for (let entity of this.rangeSystem.entities) {
      entity.components.range.isVisible = !entity.components.range.isVisible;
    }

    sprite.visible = !sprite.visible;
  }
};
