import ECS from 'yagl-ecs';
import globals from 'globals';

export default class Health extends ECS.System {
  constructor(ecs, freq) {
    super(freq);
    this.ecs = ecs;
  }

  test(entity) {
    return !!entity.components.health;
  }

  update(entity) {
    let {components: cs} = entity;
    if (cs.sprite && cs.sprite.pixiSprite) {
      if (typeof(cs.health.mask) !== "undefined") {
        cs.health.mask.alpha = 1 - cs.health.health / cs.health.initialHealth;
      } else {
        cs.sprite.pixiSprite.alpha = cs.health.health / cs.health.initialHealth;
      }
    }

    if (cs.health.health <= 0) {
      this.ecs.removeEntity(entity);
      if (cs.movement) {
        globals.player.score += 1;
      }
    }
  }
}
