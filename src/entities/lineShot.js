import ECS from 'yagl-ecs';
import * as PIXI from 'pixi.js'
import Sprite from 'components/Sprite';
import FadeOut from 'components/FadeOut';

export default function lineShot(origin, target) {
  var line = new PIXI.Graphics();
  line.lineStyle(5, 0x4400DD, 1);
  line.moveTo(...origin.asArray());
  line.lineTo(...target.asArray());

  let shot = new ECS.Entity(null, [Sprite, FadeOut]);
  shot.components.sprite.pixiSprite = line;
  return shot;
}
