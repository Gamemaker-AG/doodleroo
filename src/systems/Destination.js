import ECS from 'yagl-ecs';
import globals from 'globals';

export default class Destination extends ECS.System {
  // This system destroys enemies that reached their goal and deducts health form the player
  constructor (ecs) {
    super();
    this.ecs = ecs;
  }
  test (entity) {
    return entity.components.followPath &&
      entity.components.goal &&
      entity.components.gridPosition;
  }

  update (entity) {
    if (entity.components.goalPath) {
      let { path } = entity.components.goalPath;
      if (entity.components.gridPosition.x === path[path.length - 1][0] &&
        entity.components.gridPosition.y === path[path.length - 1][1]) {
        globals.player.deduct_life();
        this.ecs.removeEntity(entity);
      }
    }
  }
}
