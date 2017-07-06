import * as PIXI from 'pixi.js';
import globals from 'globals';
import ECS from 'yagl-ecs';
import * as actions from 'button-actions';

export default class Construction extends ECS.System {
  test() {
    return true;
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
}
