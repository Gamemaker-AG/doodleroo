import * as PIXI from 'pixi.js';
import ECS from 'yagl-ecs';

import Render from './systems/Render.js';
import Sprite from './components/Sprite.js';

const game = new ECS();
const menu = new ECS();
let current_state = menu;

function gameLoop() {
    current_state.update();
    requestAnimationFrame(gameLoop);
}

function startGame () {
    menu.addSystem(new Render());

    let entity = new ECS.Entity(null, [Sprite]);
    console.log(entity);
    entity.components.sprite.pixiSprite = new PIXI.Sprite.fromImage('red_square');
    menu.addEntity(entity);

    gameLoop();
}

const loader = new PIXI.loaders.Loader();

loader
    .add('red_square', '/img/red_square.png')
    .load(startGame);
