import ECS from 'yagl-ecs';
import * as PIXI from 'pixi.js';

import { hasSprite } from 'components/Sprite';
import * as actions from 'button-actions';
import PixiVector from 'PixiVector';
import ZIndex from 'components/ZIndex';

import globals from '../globals';
import { tower_types } from 'entities/towers';

export default class Button extends ECS.System {
  constructor (stage) {
    super();
    this.stage = stage;
  }

  collect (entity) {
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
        if (name == 'click') {
          entity.components.sprite.pixiSprite['tap'] = action;
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

  [ actions.TOGGLE_TOWER_MENU ](constructionMenu, worldPos, gridPos, addEntity, removeEntity, baseTower, baseTowerEntity) {
    let {pixiSprite} = constructionMenu.components.sprite;
    let hasMoved = !worldPos.equals(pixiSprite.position);
    pixiSprite.removeChildren();

    if (!hasMoved && pixiSprite.visible) {
      console.log('hide menu');
      pixiSprite.visible = false;
    } else {
      console.log('show menu');
      pixiSprite.visible = true;
      pixiSprite.position = worldPos.clone();
      constructionMenu.components.gridPosition = gridPos;

      let towers;

      if (baseTower === undefined || baseTowerEntity === undefined) {
        towers = tower_types.filter(tower => {
          return tower.base === 'standard';
        });
      } else {
        towers = tower_types.filter(tower => {
          return tower.base === baseTower;
        });
      }

      let angle = (Math.PI * 2) / towers.length;
      let towerContainer = new PIXI.Container();

      towers.forEach((tower, index) => {
        let pos = new PixiVector(pixiSprite.height / 2, 0).rotate((angle * index) - Math.PI / 2);
        let towerEntity = tower.factory(pos.x, pos.y);

        let clickaction = () => {
          if (towerEntity.components.purchased.cost <= globals.player.gold) {
            globals.player.gold -= towerEntity.components.purchased.cost;
            console.log('Constructing at:',
              constructionMenu.components.gridPosition.x,
              constructionMenu.components.gridPosition.y
            );

            let towerToAdd = tower.factory(worldPos.x, worldPos.y);

            if (!baseTower || !baseTowerEntity) {
              towerToAdd.components.button.actions.click = [actions.TOGGLE_TOWER_MENU, constructionMenu, worldPos, constructionMenu.components.gridPosition, addEntity, removeEntity, tower.factory.name, towerToAdd];
            } else {
              removeEntity(baseTowerEntity);
            }

            addEntity(towerToAdd);
          }
        };

        towerEntity.components.sprite.pixiSprite.click = clickaction;
        towerEntity.components.sprite.pixiSprite.on('tap', clickaction);

        towerEntity.components.sprite.pixiSprite.alpha = 2;

        let dumb_entity = new ECS.Entity(null, []);
        dumb_entity.addComponent('menuTower', {});
        dumb_entity.addComponent('purchased', towerEntity.components.purchased);
        dumb_entity.components.systemlessSprite = towerEntity.components.sprite;

        pixiSprite.addChild(dumb_entity.components.systemlessSprite.pixiSprite);

        addEntity(dumb_entity);
      });

      pixiSprite.addChild(towerContainer);
    }
  }
};
