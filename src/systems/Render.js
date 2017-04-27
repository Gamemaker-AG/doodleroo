import * as PIXI from 'pixi.js';
import ECS from 'yagl-ecs';

export default class Render extends ECS.System {
    constructor() {
        super();

        this.renderer = PIXI.autoDetectRenderer(800, 600);
        this.renderer.backgroundColor = 0xFFFFFF;
        document.body.appendChild(this.renderer.view);

        this.stage = new PIXI.Container();
    }

    test(entity) {
        return entity.components.sprite &&
            entity.components.sprite.pixiSprite;
    }

    enter(entity) {
        this.stage.addChild(entity.components.sprite.pixiSprite);
    }

    exit(entity) {
        this.stage.removeChild(entity.components.sprite.pixiSprite);
    }

    update(entity) {
        this.renderer.render(this.stage);
    }
}
