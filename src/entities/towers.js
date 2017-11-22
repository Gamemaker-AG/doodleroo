import globals from 'globals';
import spriteEntity from 'entities/spriteEntity';
import PixiVector from 'PixiVector';
import * as actions from 'button-actions';

export const tower_types = [
  {factory: machineGunTower},
  {factory: splashTower},
  {factory: tankTower},
  {factory: healTower}
];

function baseTower (x, y, image) {
  let gridPos = new PixiVector(x, y).toGrid();
  let entity = spriteEntity(x, y, image);

  let { pixiSprite } = entity.components.sprite;

  pixiSprite.anchor.set(0.5, 0.5);
  pixiSprite.scale.set(globals.slotSize / pixiSprite.texture.height);
  pixiSprite.hitArea = new PIXI.Rectangle(-globals.slotSize / 2 - 5, -globals.slotSize / 2 - 5, globals.slotSize + 10, globals.slotSize + 10);
  pixiSprite.interactive = true;

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

  return entity;
}

function machineGunTower (x, y) {
  let entity = baseTower(x, y, 'tower_machineGun');

  entity.addComponent('range', {range: 2, color: 0xFF0000, isVisible: globals.showRange});
  entity.addComponent('attack', {rate: 5, timeSinceLastAttack: 0, damage: 20, bulletType: 'bullet'});
  entity.components.obstacle.cost = 3;
  entity.components.purchased.cost = 200;

  return entity;
}

function splashTower (x, y) {
  let entity = baseTower(x, y, 'tower_splash');

  let top = new PIXI.Sprite(PIXI.loader.resources['tower_splash_top'].texture);
  top.anchor.set(0.21, 0.46);
  top.scale.set(entity.components.sprite.pixiSprite.scale.x);
  entity.components.sprite.pixiSprite.addChild(top);

  entity.addComponent('range', {range: 3, color: 0xFF0000, isVisible: globals.showRange});
  entity.addComponent('attack', {rate: 0.5, timeSinceLastAttack: 0, damage: 10, bulletType: 'bullet'});
  entity.components.obstacle.cost = 3;
  entity.components.purchased.cost = 300;

  return entity;
}

function tankTower (x, y) {
  let entity = baseTower(x, y, 'tower_tank');

  entity.components.obstacle.cost = 3;
  entity.components.purchased.cost = 200;

  return entity;
}

function healTower (x, y) {
  let entity = baseTower(x, y, 'tower_heal');

  entity.addComponent('range', {range: 5, color: 0xFF0000, isVisible: globals.showRange});
  entity.components.obstacle.cost = 3;
  entity.components.purchased.cost = 300;

  // implement heal behaviour

  return entity;
}
