import ECS from 'yagl-ecs';
import lineShot from 'entities/lineShot';

export default class Attack extends ECS.System {
  constructor (ecs, freq) {
    super(freq);
    this.ecs = ecs;
  }

  test (entity) {
    return !!entity.components.attack;
  }

  update (entity) {
    let {attack} = entity.components;

    if (attack.unitToAttack &&
      attack.timeSinceLastAttack >= (1 / attack.rate)) {
        this.attack(entity, attack.unitToAttack);
        attack.timeSinceLastAttack = 0;
    }

    attack.timeSinceLastAttack += window.dt;
  }

  attack (source, enemy) {
    let {position: origin} = source.components.sprite.pixiSprite;
    let {position: target} = enemy.components.sprite.pixiSprite;
    this.ecs.addEntity(lineShot(origin, target));

    if (source.components.slow) {
      // slow
      if (source.components.slow.duration > enemy.components.movement.slowDuration) {
        enemy.components.movement.slowDuration = source.components.slow.duration;
      }

      enemy.components.movement.speedFactor = source.components.slow.speedFactor;
    } else {
      // attack
      enemy.components.health.health -= source.components.attack.damage;
    }
  }
};
