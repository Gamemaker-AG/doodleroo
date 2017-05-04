import * as PIXI from 'pixi.js';
import ECS from 'yagl-ecs';

import Render from './systems/Render.js';
import Movement from './systems/Movement.js';
import Sprite from './components/Sprite.js';

const game = new ECS();
const menu = new ECS();
let current_state = menu;
let ticker;

function gameLoop () {
  window.dt = ticker.deltaTime;
  current_state.update();
}

function startGame () {
  menu.addSystem(new Render());
  menu.addSystem(new Movement());

  let entity = new ECS.Entity(null, [Sprite]);
  console.log(entity);
  entity.components.sprite.pixiSprite = new PIXI.Sprite.fromImage('red_square');
  menu.addEntity(entity);
  ticker = new PIXI.ticker.Ticker();
  ticker.add(gameLoop);
  ticker.start();
}

function buildGrid () {
}

const loader = new PIXI.loaders.Loader();

loader
  .add('red_square', '/img/red_square.png')
  .load(startGame);
