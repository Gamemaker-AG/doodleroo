import globals from 'globals';
import spriteEntity from 'entities/spriteEntity';
import * as actions from 'button-actions';

export default function towerEntity (x, y, specs) {
  globals.player.gold -= specs[3];
  let entity = spriteEntity(...specs);
  let {pixiSprite} = entity.components.sprite;
  pixiSprite.anchor.set(0.5, 0.5);
  pixiSprite.scale.set(globals.slotSize / pixiSprite.texture.height);

  if (specs[2] === 'tower_weak') {
    let rotatable = new PIXI.Sprite(PIXI.loader.resources['tower_weak_top'].texture);
    rotatable.anchor.set(0.5, 0.5);
    rotatable.scale.set(pixiSprite.scale.x);
    pixiSprite.addChild(rotatable);
  }

  if (specs[2] === 'tower_long') {
    entity.addComponent('slow', {speedFactor: 0.5, duration: 0.8});
  }

  entity.addComponent('range', {range: specs[4], color: 0xFF0000, isVisible: globals.showRange});
  entity.addComponent('obstacle', {cost: 3});
  entity.addComponent('health', {health: 100, initialHealth: 100});
  entity.addComponent('gridPosition', {x: x, y: y});
  entity.addComponent('purchased', {cost: specs[3]});
  entity.addComponent('attack', {rate: 0.5, timeSinceLastAttack: 0, damage: specs[5]});
  entity.addComponent('button', {
    actions: {
      'mouseover': [actions.TOGGLE_SHOW_RANGES_SINGLE, entity, globals.showRange],
      'mouseout': [actions.TOGGLE_SHOW_RANGES_SINGLE, entity, globals.showRange]
    }
  });
  return entity;
};
