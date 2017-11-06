import ECS from 'yagl-ecs';
import { hasSprite } from 'components/Sprite';
import PixiVector from 'PixiVector';
import globals from 'globals';

export default class Bullet extends ECS.System {
  constructor (ecs, enemies, freq) {
    super(freq);
    this.ecs = ecs;
    this.enemies = enemies;
  }

  test (entity) {
    return entity.components.bullet && hasSprite(entity);
  }

  update (entity) {
    let {pixiSprite} = entity.components.sprite;
    let {target} = entity.components.bullet;

    if (target && !this.enemies[entity.components.bullet.target.id]) {
      target = null;
    }

    if (target) {
      let posVec = new PixiVector(pixiSprite.x, pixiSprite.y);
      let targetVec = new PixiVector(target.components.sprite.pixiSprite.x, target.components.sprite.pixiSprite.y);

      if (posVec.distance(targetVec) < 5) {
        if (entity.components.splash) {
          // deal splash damage
          for (let i in this.enemies) {
            if (this.enemies.hasOwnProperty(i)) {
              let otherPos = new PixiVector(
                this.enemies[i].components.sprite.pixiSprite.x,
                this.enemies[i].components.sprite.pixiSprite.y
              );

              if (targetVec.clone().distance(otherPos) <= entity.components.splash.splashRadius * globals.slotSize) {
                this.enemies[i].components.health.health -= entity.components.attack.damage;
              }
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
