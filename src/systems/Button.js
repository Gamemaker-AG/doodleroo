import ECS from 'yagl-ecs';
import * as PIXI from 'pixi.js';

import { hasSprite } from 'components/Sprite';
import * as actions from 'button-actions';

import globals from '../globals';

export default class Button extends ECS.System {
  constructor (stage) {
    super();
    this.stage = stage;
  }

  collect(entity) {
    return {
      hasRange: !!entity.components.range
    };
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
        entity.components.sprite.pixiSprite[name] = action;
        if (name == "click") {
          entity.components.sprite.pixiSprite["tap"] = action;
        }
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

  [ actions.MOUSE_OVER_IMAGE ] (entity, image) {
    entity.components.sprite.pixiSprite.texture = PIXI.loader.resources[image].texture;
  }

  [ actions.MOUSE_EXIT_IMAGE ] (entity, image) {
    entity.components.sprite.pixiSprite.texture = PIXI.loader.resources[image].texture;
  }

  [ actions.MOUSE_DOWN_IMAGE ] (entity, image) {
    entity.components.sprite.pixiSprite.texture = PIXI.loader.resources[image].texture;
  }

  [ actions.TOGGLE_SHOW_RANGES_ALL ] (sprite) {
    globals.showRange = !globals.showRange;
    for (let entity of this.collections.hasRange) {
      entity.components.range.isVisible = globals.showRange;
    }

    sprite.visible = !sprite.visible;
  }

  [actions.TOGGLE_TOWER_MENU](constructionMenu, worldPos, gridPos) {
    let {pixiSprite} = constructionMenu.components.sprite;
    let hasMoved = !worldPos.equals(pixiSprite.position);
    if (!hasMoved && pixiSprite.visible) {
      pixiSprite.visible = false;
    } else {
      pixiSprite.visible = true;
      pixiSprite.position = worldPos.clone();
      constructionMenu.components.gridPosition = gridPos;
    }
  }
};
