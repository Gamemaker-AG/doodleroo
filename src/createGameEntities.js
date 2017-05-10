import ECS from 'yagl-ecs';
import Sprite from './components/Sprite.js';

export default function createGameEntities () {
  let entities = [];

  // Towers
  let entity3 = new ECS.Entity(null, [Sprite]);
  let towerWeak = entity3.components.sprite;
  towerWeak.pixiSprite = new PIXI.Sprite.fromImage('tower_weak');
  towerWeak.pixiSprite.position.set(100, 0);
  entities.push(entity3);

  let entity4 = new ECS.Entity(null, [Sprite]);
  let towerStrong = entity4.components.sprite;
  towerStrong.pixiSprite = new PIXI.Sprite.fromImage('tower_strong');
  towerStrong.pixiSprite.position.set(100, 0);
  entities.push(entity4);

  let entity5 = new ECS.Entity(null, [Sprite]);
  let towerLong = entity5.components.sprite;
  towerLong.pixiSprite = new PIXI.Sprite.fromImage('tower_long');
  towerLong.pixiSprite.position.set(100, 0);
  entities.push(entity5);

  return entities;
}
