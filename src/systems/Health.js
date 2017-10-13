import ECS from 'yagl-ecs';

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
      cs.sprite.pixiSprite.alpha = cs.health.health / cs.health.initialHealth;
    }

    if (cs.health.health <= 0) {
      this.ecs.removeEntity(entity);
    }
  }
}
