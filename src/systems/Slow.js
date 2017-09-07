import ECS from 'yagl-ecs';
import globals from 'globals';
import lineShot from 'entities/lineShot';
import PixiVector from 'PixiVector';

export default class Slow extends ECS.System {
  constructor (ecs, freq) {
    super(freq);
    this.ecs = ecs;
    this.enemies = {};
    this.unitToSlow = null;
    this.timeSinceLastSlow = 0;
  }

  test (entity) {
    return (entity.components.enemy && entity.components.sprite) ||
      (entity.components.range && entity.components.slow && entity.components.sprite);
  }

  enter (entity) {
    if (entity.components.enemy) this.enemies[entity.id] = entity;
  }

  exit (entity) {
    if (entity.components.enemy) delete this.enemies[entity.id];
  }

  update (entity) {
    let { range, slow, sprite} = entity.components;

    if (range && slow) {
      let {position: pos} = sprite.pixiSprite;

      for (let enemy of Object.values(this.enemies)) {
        let {position: enemyPos} = enemy.components.sprite.pixiSprite;

        if (pos.distance(enemyPos) <= range.range * globals.slotSize) {
          if (!this.unitToSlow) {
            this.unitToSlow = enemy;
          }

          let {position: unitToSlowPos} = this.unitToSlow.components.sprite.pixiSprite;
          let posVec = new PixiVector(pos.x, pos.y);
          let enemyPosVec = new PixiVector(unitToSlowPos.x, unitToSlowPos.y);

          if (sprite.pixiSprite.children.length == 0) {
            sprite.pixiSprite.rotation = ((enemyPosVec.subtract(posVec)).horizontalAngle);
          } else {
            sprite.pixiSprite.getChildAt(0).rotation = ((enemyPosVec.subtract(posVec)).horizontalAngle);
          }

          if (slow.timeSinceLastSlow >= (1 / slow.rate)) {
            this.slow(entity, this.unitToSlow);
            slow.timeSinceLastSlow = 0;
          } /*else if (slow.timeSinceLastSlow >= slow.duration && this.unitToSlow.components.movement.speedFactor != 1) {
            this.unitToSlow.components.movement.speedFactor = 1
          }*/
        } else if (this.unitToSlow == enemy) {
          this.unitToSlow = null;
        }
      }

      slow.timeSinceLastSlow += window.dt;
    }
  }

  slow (tower, enemy) {
    let {position: origin} = tower.components.sprite.pixiSprite;
    let {position: target} = enemy.components.sprite.pixiSprite;
    this.ecs.addEntity(lineShot(origin, target));

    if (tower.components.slow.duration > enemy.components.movement.slowDuration) {
      enemy.components.movement.slowDuration = tower.components.slow.duration;
    }

    enemy.components.movement.speedFactor = tower.components.slow.speedFactor;
  }
};
