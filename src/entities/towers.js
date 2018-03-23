import globals from 'globals';
import spriteEntity from 'entities/spriteEntity';
import PixiVector from 'PixiVector';
import * as actions from 'button-actions';
import { paperEffect, animateImages } from 'utils';

export const tower_types = [
  {base: 'standard', factory: machineGunTower},
  {base: 'standard', factory: splashTower},
  {base: 'standard', factory: tankTower},
  {base: 'standard', factory: healTower},
  {base: 'splashTower', factory: venomTower},
  {base: 'splashTower', factory: frostTower},
  {base: 'healTower', factory: healDamageBoostTower},
  {base: 'healTower', factory: missileSwarmTower},
  {base: 'machineGunTower', factory: doubleMachineGunTower},
  {base: 'machineGunTower', factory: laserTower},
  {base: 'tankTower', factory: moreTankTower},
  {base: 'tankTower', factory: cactusTower}
];

// Declaring the base tower

function baseTower (x, y, image) {
  let gridPos = new PixiVector(x, y).toGrid();
  let entity = spriteEntity(x, y, image);

  let { pixiSprite } = entity.components.sprite;

  pixiSprite.anchor.set(0.5, 0.5);
  const scale = globals.slotSize / pixiSprite.texture.height;
  pixiSprite.scale.set(scale);
  const hitAreaSize = globals.slotSize / scale;
  pixiSprite.hitArea = new PIXI.Rectangle(
    -hitAreaSize / 2 - 5,
    -hitAreaSize / 2 - 5,
    hitAreaSize + 10,
    hitAreaSize + 10
  );
  pixiSprite.interactive = true;

  let mask = animateImages(image);
  let paper = paperEffect(mask)

  entity.addComponent('obstacle');
  entity.addComponent('health', {health: 100, initialHealth: 100});
  entity.addComponent('gridPosition', {x: gridPos.x, y: gridPos.y});
  entity.addComponent('purchased');
  entity.addComponent('button', {
    actions: {
      'mouseover': [actions.TOGGLE_SHOW_RANGES_SINGLE, entity, globals.showRange],
      'mouseout': [actions.TOGGLE_SHOW_RANGES_SINGLE, entity, globals.showRange]
    }
  });
  entity.addComponent('zIndex', {index: 2});

  pixiSprite.addChild(paper);

  return entity;
}

// Declaring the standard towers

function machineGunTower (x, y) {
  let entity = baseTower(x, y, 'tower_machineGun');

  entity.addComponent('range', {range: 2, color: 0x000000, isVisible: globals.showRange});
  entity.addComponent('attack', {rate: 5, timeSinceLastAttack: 0, damage: 20, bulletType: 'bullet'});
  entity.components.obstacle.cost = 3;
  entity.components.purchased.cost = 200;

  return entity;
}

function splashTower (x, y) {
  let entity = baseTower(x, y, 'tower_splash');

  let top = new PIXI.Sprite(PIXI.loader.resources['tower_splash_top'].texture);
  let mask = animateImages('tower_splash_top');
  let paper = paperEffect(mask)
  top.addChild(paper);


  top.anchor.set(0.21, 0.46);
  top.scale.set(entity.components.sprite.pixiSprite.scale.x);
  entity.components.sprite.pixiSprite.addChild(top);
  entity.components.sprite.topPixiSprite = top

  entity.addComponent('range', {range: 3, color: 0x000000, isVisible: globals.showRange});
  entity.addComponent('attack', {rate: 0.5, timeSinceLastAttack: 0, damage: 10, bulletType: 'bullet'});
  entity.addComponent('splash', {splashRadius: 2});
  entity.components.obstacle.cost = 3;
  entity.components.purchased.cost = 300;

  return entity;
}

function tankTower (x, y) {
  let entity = baseTower(x, y, 'tower/tank');

  entity.components.obstacle.cost = 3;
  entity.components.purchased.cost = 200;

  return entity;
}

function healTower (x, y) {
  let entity = baseTower(x, y, 'red_square');

  entity.components.obstacle.cost = 3;
  entity.components.purchased.cost = 300;
  entity.addComponent('range', {range: 5, color: 0x000000, isVisible: globals.showRange});
  entity.addComponent('heal', {rate: 0.5, timeSinceLastHeal: 0, amount: 10});

  return entity;
}

// Declaring the upgraded towers

function venomTower (x, y) {
  let entity = baseTower(x, y, 'tower_splash');

  let top = new PIXI.Sprite(PIXI.loader.resources['tower_splash_top'].texture);
  let mask = animateImages('tower_splash_top');
  let paper = paperEffect(mask)
  top.addChild(paper);
  top.anchor.set(0.21, 0.46);
  top.scale.set(entity.components.sprite.pixiSprite.scale.x);
  entity.components.sprite.pixiSprite.addChild(top);
  entity.components.sprite.topPixiSprite = top

  entity.addComponent('range', {range: 3, color: 0x000000, isVisible: globals.showRange});
  entity.addComponent('attack', {rate: 0.5, timeSinceLastAttack: 0, damage: 10, bulletType: 'poisonDart'});
  entity.addComponent('splash', {splashRadius: 2});
  entity.addComponent('poison', {poisonAmount: 0.05, duration: 2});
  entity.components.obstacle.cost = 3;
  entity.components.purchased.cost = 300;

  return entity;
}

function frostTower (x, y) {
  let entity = baseTower(x, y, 'red_square');

  entity.components.obstacle.cost = 3;
  entity.components.purchased.cost = 200;
  entity.addComponent('range', {range: 3, color: 0x000000, isVisible: globals.showRange});
  entity.addComponent('slow', {speedFactor: 0.5, duration: 0.8});

  return entity;
}

function healDamageBoostTower (x, y) {
  let entity = baseTower(x, y, 'red_square');

  entity.components.obstacle.cost = 3;
  entity.components.purchased.cost = 200;
  entity.addComponent('range', {range: 5, color: 0x000000, isVisible: globals.showRange});
  entity.addComponent('attack', {rate: 0.5, timeSinceLastAttack: 0, damage: 50, bulletType: 'bullet'});

  return entity;
}

function missileSwarmTower (x, y) {
  let entity = baseTower(x, y, 'tower/missile_launcher');

  entity.components.obstacle.cost = 3;
  entity.components.purchased.cost = 200;

  return entity;
}

function doubleMachineGunTower (x, y) {
  let entity = baseTower(x, y, 'red_square');

  entity.components.obstacle.cost = 3;
  entity.components.purchased.cost = 200;
  entity.addComponent('range', {range: 2, color: 0x000000, isVisible: globals.showRange});
  entity.addComponent('attack', {rate: 7, timeSinceLastAttack: 0, damage: 20, bulletType: 'bullet'});

  return entity;
}

function laserTower (x, y) {
  let entity = baseTower(x, y, 'red_square');

  entity.components.obstacle.cost = 3;
  entity.components.purchased.cost = 200;
  // entity.addComponent('incremental', {})

  return entity;
}

function moreTankTower (x, y) {
  let entity = baseTower(x, y, 'tower/bomb_tank');

  entity.components.obstacle.cost = 3;
  entity.components.purchased.cost = 200;
  // entity.components.health.initialHealth = Infinity
  // entity.components.health.health = Infinity

  return entity;
}

function cactusTower (x, y) {
  let entity = baseTower(x, y, 'tower_cactus');

  entity.components.obstacle.cost = 3;
  entity.components.purchased.cost = 200;
  // entity.addComponent('cactus', {})

  return entity;
}
