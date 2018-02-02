import ECS from 'yagl-ecs';
import * as PIXI from 'pixi.js';

import Attack from 'systems/Attack';
import Bullet from 'systems/Bullet';
import ButtonSystem from 'systems/Button';
import Construction from 'systems/Construction';
import Destination from 'systems/Destination';
import FadeOut from 'systems/FadeOut';
import FollowPath from 'systems/FollowPath';
import GridSystem from 'systems/Grid';
import Health from 'systems/Health';
import Movement from './systems/Movement.js';
import Render from './systems/Render.js';
import TargetInRange from './systems/TargetInRange';
import InfoPanelUpdater from 'systems/InfoPanelUpdater';
import Range from 'systems/Range';
import Spawner from 'systems/Spawner';
import UpdateGridPosition from 'systems/UpdateGridPosition';
import Heal from 'systems/Heal';
import CreepInfoPanel from 'systems/CreepInfoPanel';

import ObservablePixiVector from 'ObservablePixiVector';
import PixiVector from 'PixiVector';
import Player from 'Player';

import * as actions from 'button-actions';
import createGameEntities from 'createGameEntities';
import createMenuEntities from 'createMenuEntities';
import { buttonMuteEntity } from 'entities/ui';
import spriteEntity from 'entities/spriteEntity';
import globals from 'globals';

import sound from 'pixi-sound';

window.PIXI.Point.prototype = PixiVector.prototype;
window.PIXI.ObservablePoint.prototype = ObservablePixiVector.prototype;

let game;
let menu;
let currentState = menu;
let ticker, renderer;

const backgroundMusic = PIXI.sound.Sound.from('sounds/backgroundMusic.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = window.localStorage.getItem('volume') || 1;
backgroundMusic.play();

renderer = PIXI.autoDetectRenderer(globals.width, globals.height, {
  resolution: window.devicePixelRatio || 1
});
renderer.backgroundColor = 0xFFFFFF;
document.body.appendChild(renderer.view);
document.body.style.margin = '0';

function newState () {
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

function startMenu () {
  menu = newState();

  // Menu
  menu.ecs.addSystem(new Render(renderer, menu.stage, globals.width, globals.height));
  menu.ecs.addSystem(new ButtonSystem(undefined, menu.stage));

  createMenuEntities(startGame, backgroundMusic).forEach(e => menu.ecs.addEntity(e));

  currentState = menu;
}

function startGame () {
  globals.player = new Player(startMenu);
  window.speed = 1;
  game = newState();
  window.stage = game.stage;

  // Game
  let rangeSystem = new Range(game.ecs);

  game.ecs.addSystem(new Render(renderer, game.stage, globals.width, globals.height));
  game.ecs.addSystem(new ButtonSystem(game.stage));
  let grid = new GridSystem(10);
  game.ecs.addSystem(grid);
  game.ecs.addSystem(new Movement());
  game.ecs.addSystem(rangeSystem);
  let targetInRange = new TargetInRange(grid.obstacles);
  game.ecs.addSystem(new Attack(game.ecs));
  game.ecs.addSystem(new Bullet(game.ecs));
  game.ecs.addSystem(new Construction());
  game.ecs.addSystem(new InfoPanelUpdater());
  game.ecs.addSystem(new UpdateGridPosition());
  game.ecs.addSystem(new FollowPath(grid.obstacles));
  game.ecs.addSystem(targetInRange);
  game.ecs.addSystem(new Destination(game.ecs));
  game.ecs.addSystem(new Spawner(game.ecs));
  game.ecs.addSystem(new FadeOut(game.ecs));
  game.ecs.addSystem(new Health(game.ecs));
  game.ecs.addSystem(new Heal(grid.obstacles));
  game.ecs.addSystem(new CreepInfoPanel());

  createGameEntities((entity) => game.ecs.addEntity(entity), (entity) => game.ecs.removeEntity(entity), backgroundMusic)
    .forEach(e => game.ecs.addEntity(e));

  currentState = game;
}

function startLoop () {
  bgDiv.parentNode.removeChild(bgDiv);
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

  startMenu();
}

let bgDiv, progressBar;
window.onload = () => {
  bgDiv = document.getElementById('bgDiv');
  progressBar = document.getElementById('progressBarBackground');

  PIXI.loader
    .add('red_square', 'img/red_square.png')
    .add('green_square', 'img/green_square.png')
    .add('heart', 'img/heart.png')
    .add('coin', 'img/coin.png')
    .add('paper', 'img/paper.png')
    .add('mask', 'img/mask.png')
    .add('circular_background', 'img/circular_background.png')
    .add('creep_fast_1', 'img/creep_fast_1.png')
    .add('creep_fast_2', 'img/creep_fast_2.png')
    .add('creep_tall_1', 'img/creep_tall_1.png')
    .add('creep_tall_2', 'img/creep_tall_2.png')
    .add('tower_heal', 'img/tower_heal.png')
    .add('tower_machineGun', 'img/tower_machineGun.png')
    .add('tower_splash', 'img/tower_splash.png')
    .add('tower_splash_top', 'img/tower_splash_top.png')
    .add('tower_tank', 'img/tower_tank.png')
    .add('tower_cactus', 'img/tower_cactus.png')
    .add('bullet', 'img/bullet.png')
    .add('poisonDart', 'img/poisonDart.png')
    .add('slot', 'img/slot.png')
    .add('goal', 'img/goal.png')
    .add('start', 'img/goal.png')
    .add('wall', 'img/wall.png')
    .add('button_default', 'img/button_default.png')
    .add('button_pressed', 'img/button_pressed.png')
    .add('button_mouseover', 'img/button_mouseover.png')
    .add('button_newGame', 'img/button_newGame.png')
    .add('button_credits', 'img/button_credits.png')
    .add('button_soundSpeaker', 'img/button_soundSpeaker.png')
    .add('button_soundWaves', 'img/button_soundWaves.png')
    .add('button_soundMuted', 'img/button_soundMuted.png')
    .add('button_fast', 'img/button_fast.png')
    .add('button_slow', 'img/button_slow.png')
    .add('button_showRanges', 'img/button_showRanges.png')
    .add('button_hideRanges', 'img/button_hideRanges.png')
    .add('fak_font', 'font/fak.fnt')
    .add('logo', 'img/logo.png')
    .on('progress', (loader, resource) => {
      progressBar.children[0].style.width = loader.progress + '%';
    })
    .load(startLoop);
};
