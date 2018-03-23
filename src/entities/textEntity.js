import * as PIXI from 'pixi.js';
import ECS from 'yagl-ecs';
import Sprite from 'components/Sprite.js';
import { animateImages } from 'utils';

export default function textEntity (x, y, text, style = {font: '72px fak', stroke: '#4286f4'}) {
  let entity = new ECS.Entity(null, [Sprite]);
  let textSprite = new PIXI.extras.BitmapText(text, style);
  textSprite.anchor.set(0.5, 0.5);
  entity.components.sprite.pixiSprite = textSprite;
  entity.components.sprite.pixiSprite.position.set(x, y);
  return entity;
};
