import * as PIXI from 'pixi.js';
import ECS from 'yagl-ecs';
import {hasSprite} from 'components/Sprite';
import * as actions from "button-actions";

export default class Button extends ECS.System {
    constructor() {
        super();
    }

    test(entity) {
        return hasSprite(entity) && entity.components.button;
    }

    enter(entity) {
        entity.components.sprite.pixiSprite.interactive = true;
        entity.components.sprite.pixiSprite.click = actions.actions[entity.components.button.action];
    }

    exit(entity) {
        entity.components.button.click = undefined
    }
}
