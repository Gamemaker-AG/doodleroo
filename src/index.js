import Sprite from './components/Sprite.js';
import Render from './systems/Render.js';
import * as PIXI from 'pixi.js';
import ECS from 'yagl-ecs';
let renderer = PIXI.autoDetectRenderer(1920, 1080, {
  resolution: window.devicePixelRatio || 1
});
renderer.backgroundColor = 0xFFFFFF;

document.body.appendChild(renderer.view);
document.body.style.margin = '0';

var container = new PIXI.Container();
let stage = new PIXI.Container();

const game = new ECS();
let current_state = game;

function gameLoop () {
  window.dt = ticker.deltaTime;
  // current_state.update();
  renderer.render(stage);
}
container.addChild(stage);
let ticker = new PIXI.ticker.Ticker();
game.addSystem(new Render(renderer, 1920, 1080, stage));
ticker.add(gameLoop);
ticker.start();

var texture = PIXI.Texture.fromImage('/img/slot.png');

// Create a 5x5 grid of bunnies
for (var i = 0; i < 256; i++) {
  let entity = new ECS.Entity(null, [Sprite]);
  var bunny = new PIXI.Sprite(texture);
  bunny.anchor.set(0.5);
  bunny.x = (i % 16) * 40;
  bunny.y = Math.floor(i / 16) * 40;
  stage.addChild(bunny);
  entity.components.sprite.pixiSprite = bunny;
  game.addEntity(entity);
}


// Center on the screen
container.x = (renderer.width - container.width) / 2;
container.y = (renderer.height - container.height) / 2;

// import Movement from './systems/Movement.js';
// import ButtonSystem from 'systems/Button';
// import Button from 'components/Button';
// import createGameEntities from 'createGameEntities';
// import globals from 'globals';

// let ticker;


// const loader = new PIXI.loaders.Loader();

// function startGame () {

  // menu.addSystem(new ButtonSystem());

  // game.addSystem(new Render(renderer, globals.width, globals.height));
  // game.addSystem(new Movement());

  // // Create menu entities
  // let entity = new ECS.Entity(null, [Sprite, Button]);
  // let redSquare = entity.components.sprite;
  // redSquare.pixiSprite = new PIXI.Sprite.fromImage('red_square');
  // redSquare.pixiSprite.position.set(100, 0);
  // menu.addEntity(entity);

  // let entity2 = new ECS.Entity(null, [Sprite]);
  // let newGame = entity2.components.sprite;
  // newGame.pixiSprite = new PIXI.Text('New Game',
  //   {fontFamily: 'Arial', fontSize: 32, fill: 'blue'});
  // newGame.pixiSprite.position.set(100, 100);
  // newGame.interactive = true;
  // menu.addEntity(entity2);

//   createGameEntities().forEach(e => game.addEntity(e));

// }

// loader
//   .add('red_square', '/img/red_square.png')
//   .add('tower_weak', '/img/tower_weak.png')
//   .add('tower_strong', '/img/tower_strong.png')
//   .add('tower_long', '/img/tower_long.png')
//   .add('slot', '/img/slot.png')
//   .load(startGame);
