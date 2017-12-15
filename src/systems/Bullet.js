import ECS from 'yagl-ecs';
import { hasSprite } from 'components/Sprite';
import PixiVector from 'PixiVector';
import globals from 'globals';

export default class Bullet extends ECS.System {
  constructor (ecs, freq) {
    super(freq);
    this.ecs = ecs;
  }

  test (entity) {
    return entity.components.bullet && hasSprite(entity);
  }

  collect(entity) {
    return {
      enemies: !!entity.components.enemy
    };
  }

  update (entity) {
    let {pixiSprite} = entity.components.sprite;
    let {target} = entity.components.bullet;

    if (!this.collections.enemies.find(enemy => enemy.id == target.id)) {
      target = null;
    }

    if (target) {
      let posVec = new PixiVector(pixiSprite.x, pixiSprite.y);
      let targetVec = new PixiVector(target.components.sprite.pixiSprite.x, target.components.sprite.pixiSprite.y);

      if (posVec.distance(targetVec) < 5) {
        if (entity.components.splash) {
          // deal splash damage
          for (let enemy of this.collections.enemies) {
            let otherPos = new PixiVector(
              enemy.components.sprite.pixiSprite.x,
              enemy.components.sprite.pixiSprite.y
            );

            if (targetVec.clone().distance(otherPos) <= entity.components.splash.splashRadius * globals.slotSize) {
              enemy.components.health.health -= entity.components.attack.damage;
            }
          }
        } else {
          // deal single damage
          target.components.health.health -= entity.components.attack.damage;
        }

        this.ecs.removeEntity(entity);
        return;
      }

      let dir = (targetVec.clone().subtract(posVec)).normalize();
      dir.multiply(entity.components.bullet.bulletSpeed * window.dt);

      pixiSprite.position.set(pixiSprite.x + dir.x, pixiSprite.y + dir.y);
      pixiSprite.rotation += 10 * window.dt;
    } else {
      this.ecs.removeEntity(entity);
    }
  }
};
