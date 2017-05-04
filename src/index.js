import * as PIXI from 'pixi.js';
import ECS from 'yagl-ecs';

import Render from './systems/Render.js';
import Sprite from './components/Sprite.js';
import Button from './components/Button.js';
import * as actions from 'button-actions';
import ButtonSystem from './systems/Button.js';

console.log(actions);
const game = new ECS();
const menu = new ECS();
let current_state = menu;

function gameLoop () {
    current_state.update();
    requestAnimationFrame(gameLoop);
}

function startGame () {
    menu.addSystem(new Render());
    menu.addSystem(new ButtonSystem());

    let entity = new ECS.Entity(null, [Sprite, Button]);
    // entity.updateComponent('button', {
    //     action: actions[]
    // });
    entity.components.sprite.pixiSprite = new PIXI.Sprite.fromImage('red_square');

    menu.addEntity(entity);

    gameLoop();
}

const loader = new PIXI.loaders.Loader();

loader
    .add('red_square', '/img/red_square.png')
    .load(startGame);
