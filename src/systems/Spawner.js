import ECS from 'yagl-ecs';
import { spriteEntity } from 'createGameEntities';
import PixiVector from 'PixiVector';
import baseCreep from 'entities/creeps';

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
    let entity = baseCreep(x, y, 100);
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
