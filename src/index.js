import * as PIXI from 'pixi.js';
import ECS from 'yagl-ecs';

import Render from './systems/Render.js';
import Sprite from './components/Sprite.js';
import ButtonSystem from 'systems/Button';
import Button from 'components/Button';

const game = new ECS();
const menu = new ECS();
let current_state = menu;

const Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = new PIXI.loaders.Loader(),
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Texture = PIXI.Texture,
    Graphics = PIXI.Graphics,
    Text = PIXI.Text;
    //Sprite = PIXI.Sprite;

function gameLoop() {
    current_state.update();
    requestAnimationFrame(gameLoop);
}

function startGame () {
    menu.addSystem(new Render());
    menu.addSystem(new ButtonSystem());

    let entity = new ECS.Entity(null, [Sprite, Button]);
		let redSquare = entity.components.sprite;
    redSquare.pixiSprite = new PIXI.Sprite.fromImage('red_square');

		redSquare.pixiSprite.position.set(100, 0);
    menu.addEntity(entity);
    let entity2 = new ECS.Entity(null, [Sprite]);
		let newGame = entity2.components.sprite;
		newGame.pixiSprite = new Text("New Game",
													{fontFamily: "Arial", fontSize: 32, fill: "blue"});
		newGame.pixiSprite.position.set(100, 100);
    newGame.interactive = true;
		menu.addEntity(entity2);
		

    gameLoop();
}

loader
    .add('red_square', '/img/red_square.png')
    .load(startGame);
