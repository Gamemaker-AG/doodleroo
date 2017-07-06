import * as PIXI from 'pixi.js';
import ECS from 'yagl-ecs';
import {hasSprite} from 'components/Sprite';
import * as actions from 'button-actions';

export default class Button extends ECS.System {
  constructor () {
    super();
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
      } else if (action !== null){
        let args = [];
        if (action instanceof Array) {
          [action, ...args] = action;
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
}
