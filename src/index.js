import * as PIXI from 'pixi.js';
import ECS from 'yagl-ecs';
import Vector from 'vigur';

import Render from './systems/Render.js';
import Movement from './systems/Movement.js';
import Sprite from './components/Sprite.js';
import ButtonSystem from 'systems/Button';
import GridSystem from 'systems/Grid';
import FollowPath from 'systems/FollowPath';
import Button from 'components/Button';
import Range from 'systems/Range';
import Attack from 'systems/Attack';
import Construction from 'systems/Construction';
import UpdateGridPosition from 'systems/UpdateGridPosition';
import InfoPanelUpdater from 'systems/InfoPanelUpdater';
import createGameEntities from 'createGameEntities';
import createMenuEntities from 'createMenuEntities';
import globals from 'globals';
import PixiVector from 'PixiVector';
import ObservablePixiVector from 'ObservablePixiVector';
import Player from 'Player';

window.PIXI.Point.prototype = PixiVector.prototype;
window.PIXI.ObservablePoint.prototype = ObservablePixiVector.prototype;

const game = newGameState();
const menu = newGameState();
let current_state = menu;
let ticker, renderer;

let newGame = function () {
  current_state = game;
};

function newGameState () {
  return {
    stage: new PIXI.Container(),
    ecs: new ECS()
  };
}

function gameLoop () {
  window.dt = ticker.elapsedMS / 1000;
  current_state.ecs.update();
  renderer.render(current_state.stage);
}

function startGame () {
  renderer = PIXI.autoDetectRenderer(globals.width, globals.height, {
    resolution: window.devicePixelRatio || 1
  });
  renderer.backgroundColor = 0xFFFFFF;
  document.body.appendChild(renderer.view);
  document.body.style.margin = '0';

  globals.player = new Player();

  menu.ecs.addSystem(new Render(renderer, menu.stage, globals.width, globals.height));
  menu.ecs.addSystem(new ButtonSystem());

  game.ecs.addSystem(new Render(renderer, game.stage, globals.width, globals.height));
  game.ecs.addSystem(new ButtonSystem());
  game.ecs.addSystem(new GridSystem(1));
  game.ecs.addSystem(new Movement());
  game.ecs.addSystem(new Range(game.stage));
  game.ecs.addSystem(new Attack());
  game.ecs.addSystem(new Construction());
  game.ecs.addSystem(new InfoPanelUpdater());
  game.ecs.addSystem(new UpdateGridPosition());
  game.ecs.addSystem(new FollowPath());

  createMenuEntities(newGame).forEach(e => menu.ecs.addEntity(e));
  createGameEntities((entity) => game.ecs.addEntity(entity))
    .forEach(e => game.ecs.addEntity(e));

  ticker = new PIXI.ticker.Ticker();
  ticker.add(gameLoop);
  ticker.start();
}

PIXI.loader
  .add('red_square', '/img/red_square.png')
  .add('circular_background', '/img/circular_background.png')
  .add('tower_weak', '/img/tower_weak.png')
  .add('tower_strong', '/img/tower_strong.png')
  .add('tower_long', '/img/tower_long.png')
  .add('slot', '/img/slot.png')
  .add('button_newGame', '/img/button_newGame.png')
  .add('button_credits', '/img/button_credits.png')
  .add('button_soundEnabled', '/img/button_soundEnabled.png')
  .add('button_soundDisabled', '/img/button_soundDisabled.png')
  .load(startGame);
