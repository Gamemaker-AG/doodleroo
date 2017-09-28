import ECS from 'yagl-ecs';
import { spriteEntity } from 'createGameEntities';
import PixiVector from 'PixiVector';
import randomCreeps from 'entities/creeps';

export default class Spawner extends ECS.System {
  constructor (ecs, freq) {
    super(freq);
    this.ecs = ecs;
  }

  test (entity) {
    return entity.components.spawner;
  }

  setUpWave (spawnerEntity) {
    let { spawner } = spawnerEntity.components;
    let { x, y } = spawnerEntity.components.gridPosition;
    spawner.inWave = true;
    spawner.timeSinceWave = 0;
    spawner.toSpawn = randomCreeps(x, y, 1000);
  }

  spawn (spawnerEntity) {
    let { spawner } = spawnerEntity.components;
    if (spawner.toSpawn.length > 0) {
      this.ecs.addEntity(spawner.toSpawn.pop());
    } else {
      spawner.inWave = false;
    }
  }

  update (entity) {
    let { spawner } = entity.components;
    spawner.timeSinceSpawn += window.dt;
    if (!spawner.inWave) {
      spawner.timeSinceWave += window.dt;
      if (spawner.timeSinceWave > spawner.waveDelay) {
        this.setUpWave(entity);
      }
    }
    if (spawner.timeSinceSpawn > spawner.interval && spawner.inWave) {
      this.spawn(entity);
      spawner.timeSinceSpawn = 0;
    }
  }
}
