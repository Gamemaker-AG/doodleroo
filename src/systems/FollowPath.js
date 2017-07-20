import ECS from 'yagl-ecs';
import PixiVector from 'PixiVector';

export default class FollowPath extends ECS.System {
  test (entity) {
    return entity.components &&
      entity.components.goal &&
      entity.components.gridPosition &&
      entity.components.movement;
  }

  update (entity) {
    // set movement vector such that it points to the next gridPosition along the path
    let sprite = entity.components.sprite.pixiSprite;
    let worldPos = new PixiVector(sprite.position.x, sprite.position.y);
    entity.components.gridPosition = worldPos.toGrid();
    let {x, y} = entity.components.gridPosition;
    let currentIndex = entity.components.goalPath.path.findIndex((el) => {
      return el[0] === x && el[1] === y;
    });
    let goal = undefined;
    if (typeof entity.components.goalPath.path === 'undefined') {
      entity.components.movement.velocity = new PixiVector(0, 0);
      return;
    }
    if (currentIndex === -1) {
      goal = entity.components.goalPath.path[0];
    } else if (currentIndex + 1 < entity.components.goalPath.path.length) {
      goal = entity.components.goalPath.path[currentIndex + 1];
    } else {
      goal = entity.components.goalPath.path[entity.components.goalPath.path.length - 1];
    }
    let currentWorld = new PixiVector(x, y).toWorld();
    let goalWorld = new PixiVector(goal[0], goal[1]).toWorld();
    let direction = goalWorld.subtract(currentWorld);
    entity.components.movement.velocity = direction.normalized.multiply(5);
  }
}
