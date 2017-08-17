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
    if (entity.components.health.health <= 0) {
      this.ecs.removeEntity(entity);
    }
  }
}
