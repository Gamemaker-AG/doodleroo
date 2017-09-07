import ECS from 'yagl-ecs';
import { spriteEntity } from 'createGameEntities';
import PixiVector from 'PixiVector';

export default class Spawner extends ECS.System {
  constructor (ecs, freq) {
    super(freq);
    this.ecs = ecs;
  }

  test (entity) {
    return entity.components.spawner;
  }

  spawn (spawnerEntity) {
    let { spawner } = spawnerEntity.components;
    let { x, y } = spawnerEntity.components.gridPosition;
    let vec = new PixiVector(x, y).toWorld();
    let entity = spriteEntity(vec.x, vec.y, 'tower_weak');
    entity.components.sprite.pixiSprite.anchor.set(0.5, 0.5);
    entity.addComponent('spawned');
    for (let [name, value] of Object.entries(spawner.enemyComponents(x, y))) {
      entity.addComponent(name, value);
    }
    this.ecs.addEntity(entity);
  }

  update (entity) {
    let { spawner } = entity.components;
    spawner.timeSinceSpawn += window.dt;
    if (spawner.timeSinceSpawn > spawner.interval) {
      this.spawn(entity);
      spawner.timeSinceSpawn = 0;
    }
  }
}
