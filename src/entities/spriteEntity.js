import * as PIXI from 'pixi.js';
import ECS from 'yagl-ecs';
import Sprite from 'components/Sprite.js';
import { animateImages } from 'utils';

export default function spriteEntity (x, y, imgName) {
  let entity = new ECS.Entity(null, [Sprite]);
  entity.components.sprite.pixiSprite = animateImages(imgName);
  entity.components.sprite.pixiSprite.position.set(x, y);
  return entity;
};
