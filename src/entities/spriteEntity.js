import * as PIXI from 'pixi.js';
import ECS from 'yagl-ecs';
import Sprite from 'components/Sprite.js';

export default function spriteEntity (x, y, imgName) {
  let entity = new ECS.Entity(null, [Sprite]);
  let sprite = entity.components.sprite;
  sprite.pixiSprite = new PIXI.Sprite(PIXI.loader.resources[imgName].texture);
  sprite.pixiSprite.position.set(x, y);
  return entity;
};
