import ECS from 'yagl-ecs';
import * as PIXI from 'pixi.js';

import Attack from 'systems/Attack';
import ButtonSystem from 'systems/Button';
import Construction from 'systems/Construction';
import Destination from 'systems/Destination';
import FadeOut from 'systems/FadeOut';
import FollowPath from 'systems/FollowPath';
import GridSystem from 'systems/Grid';
import Health from 'systems/Health';
import InfoPanelUpdater from 'systems/InfoPanelUpdater';
import ObservablePixiVector from 'ObservablePixiVector';
import PixiVector from 'PixiVector';
import Player from 'Player';
import Range from 'systems/Range';
import Spawner from 'systems/Spawner';
import UpdateGridPosition from 'systems/UpdateGridPosition';
import createGameEntities from 'createGameEntities';
import createMenuEntities from 'createMenuEntities';
import globals from 'globals';

import Movement from './systems/Movement.js';
import Render from './systems/Render.js';
import TargetInRange from './systems/TargetInRange';

window.PIXI.Point.prototype = PixiVector.prototype;
window.PIXI.ObservablePoint.prototype = ObservablePixiVector.prototype;

const game = newGameState();
const menu = newGameState();
let currentState = menu;
let ticker, renderer;

let newGame = function () {
  currentState = game;
};

function newGameState () {
  return {
    stage: new PIXI.Container(),
    ecs: new ECS()
  };
}

function gameLoop () {
  window.dt = ticker.elapsedMS * window.speed / 1000;
  currentState.ecs.update();
  renderer.render(currentState.stage);
}

function startGame () {
  renderer = PIXI.autoDetectRenderer(globals.width, globals.height, {
    resolution: window.devicePixelRatio || 1
  });
  renderer.backgroundColor = 0xFFFFFF;
  document.body.appendChild(renderer.view);
  document.body.style.margin = '0';

  globals.player = new Player();

  // Menu
  menu.ecs.addSystem(new Render(renderer, menu.stage, globals.width, globals.height));
  menu.ecs.addSystem(new ButtonSystem());

  // Game
  let rangeSystem = new Range(game.stage);

  game.ecs.addSystem(new Render(renderer, game.stage, globals.width, globals.height));
  game.ecs.addSystem(new ButtonSystem(rangeSystem));
  let grid = new GridSystem(10);
  game.ecs.addSystem(grid);
  game.ecs.addSystem(new Movement());
  game.ecs.addSystem(rangeSystem);
  game.ecs.addSystem(new Attack(game.ecs));
  game.ecs.addSystem(new Construction());
  game.ecs.addSystem(new InfoPanelUpdater());
  game.ecs.addSystem(new UpdateGridPosition());
  game.ecs.addSystem(new FollowPath(grid.towers));
  game.ecs.addSystem(new TargetInRange(grid.towers));
  game.ecs.addSystem(new Destination(game.ecs));
  game.ecs.addSystem(new Spawner(game.ecs));
  game.ecs.addSystem(new FadeOut(game.ecs));
  game.ecs.addSystem(new Health(game.ecs));

  createMenuEntities(newGame).forEach(e => menu.ecs.addEntity(e));
  createGameEntities((entity) => game.ecs.addEntity(entity))
    .forEach(e => game.ecs.addEntity(e));

  window.speed = 1;
  ticker = new PIXI.ticker.Ticker();
  ticker.add(gameLoop);
  ticker.start();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      ticker.stop();
    } else {
      ticker.start();
    }
  });
}

PIXI.loader
  .add('red_square', 'img/red_square.png')
  .add('green_square', 'img/green_square.png')
  .add('heart', 'img/heart.png')
  .add('coin', 'img/coin.png')
  .add('circular_background', 'img/circular_background.png')
  .add('tower_weak', 'img/tower_weak.png')
  .add('tower_weak_top', 'img/tower_weak_top.png')
  .add('tower_strong', 'img/tower_strong.png')
  .add('tower_long', 'img/tower_long.png')
  .add('slot', 'img/slot.png')
  .add('goal', 'img/goal.png')
  .add('wall', 'img/wall.png')
  .add('button_newGame', 'img/button_newGame.png')
  .add('button_credits', 'img/button_credits.png')
  .add('button_soundEnabled', 'img/button_soundEnabled.png')
  .add('button_soundDisabled', 'img/button_soundDisabled.png')
  .add('button_fast', 'img/button_fast.png')
  .add('button_slow', 'img/button_slow.png')
  .load(startGame);
