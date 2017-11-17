import globals from 'globals';
import spriteEntity from 'entities/spriteEntity';
import * as actions from 'button-actions';

export default function towerEntity (x, y, specs) {
  let bulletType = 'bullet'; // default
  globals.player.gold -= specs.cost;
  let entity = spriteEntity(specs.x, specs.y, specs.img);
  let {pixiSprite} = entity.components.sprite;
  pixiSprite.anchor.set(0.5, 0.5);
  pixiSprite.scale.set(globals.slotSize / pixiSprite.texture.height);
  pixiSprite.hitArea = new PIXI.Rectangle(-globals.slotSize / 2 - 5, -globals.slotSize / 2 - 5, globals.slotSize + 10, globals.slotSize + 10);

  // if (specs[2] === 'tower_weak') {
  if (specs.rotatableAnchor) {
    let rotatable = new PIXI.Sprite(PIXI.loader.resources['tower_weak_top'].texture);
    rotatable.anchor.set(specs.rotatableAnchor.x, specs.rotatableAnchor.y);
    rotatable.scale.set(pixiSprite.scale.x);
    pixiSprite.addChild(rotatable);
  }

  if (specs.img === 'tower_long') {
    entity.addComponent('slow', {speedFactor: 0.5, duration: 0.8});
    bulletType = 'laser';
  }

  if (specs.img === 'tower_strong') {
    entity.addComponent('splash', {splashRadius: 3});
  }

  entity.addComponent('range', {range: specs.range, color: 0xFF0000, isVisible: globals.showRange});
  entity.addComponent('obstacle', {cost: 3});
  entity.addComponent('health', {health: 100, initialHealth: 100});
  entity.addComponent('gridPosition', {x: x, y: y});
  entity.addComponent('purchased', {cost: specs.cost});
  entity.addComponent('attack', {rate: 0.5, timeSinceLastAttack: 0, damage: specs.damage, bulletType: bulletType});
  entity.addComponent('button', {
    actions: {
      'mouseover': [actions.TOGGLE_SHOW_RANGES_SINGLE, entity, globals.showRange],
      'mouseout': [actions.TOGGLE_SHOW_RANGES_SINGLE, entity, globals.showRange]
    }
  });
  return entity;
};
