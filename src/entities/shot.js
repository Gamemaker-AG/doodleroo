import ECS from 'yagl-ecs';
import * as PIXI from 'pixi.js';
import Sprite from 'components/Sprite';
import Bullet from 'components/Bullet';
import FadeOut from 'components/FadeOut';

export default function shot (origin, enemy, source) {
  let bullet;
  let { attack } = source.components;

  switch (attack.bulletType) {
    case 'bullet':
      let bulletSprite = new PIXI.Sprite(PIXI.loader.resources['bullet'].texture);
      bulletSprite.anchor.set(0.5, 0.5);
      bulletSprite.position.set(origin.x, origin.y);
      bulletSprite.scale.set(0.4);

      bullet = new ECS.Entity(null, [Sprite, Bullet]);
      bullet.components.bullet.target = enemy;
      bullet.components.sprite.pixiSprite = bulletSprite;

      break;

    case 'poisonDart':
      let poisonDartSprite = new PIXI.Sprite(PIXI.loader.resources['poisonDart'].texture);
      poisonDartSprite.anchor.set(0.5, 0.5);
      poisonDartSprite.position.set(origin.x, origin.y);
      poisonDartSprite.scale.set(0.6);

      bullet = new ECS.Entity(null, [Sprite, Bullet]);
      bullet.components.bullet.target = enemy;
      bullet.components.sprite.pixiSprite = poisonDartSprite;

      break;

    case 'laser':
      let line = new PIXI.Graphics();
      line.lineStyle(5, 0x4400DD, 1);
      line.moveTo(...origin.asArray());
      line.lineTo(...enemy.components.sprite.pixiSprite.position.asArray());

      bullet = new ECS.Entity(null, [Sprite, FadeOut]);
      bullet.components.sprite.pixiSprite = line;

      break;

    default:
      bullet = null;
      break;
  }

  if (bullet) {
    if (source.components.attack) {
      bullet.components.attack = source.components.attack;
    }

    if (source.components.slow) {
      bullet.components.slow = source.components.slow;
    }

    if (source.components.splash) {
      bullet.components.splash = source.components.splash;
    }

    if (source.components.poison) {
      bullet.components.poison = source.components.poison;
    }
  }

  return bullet;
};
