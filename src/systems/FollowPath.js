import ECS from 'yagl-ecs';
import PixiVector from 'PixiVector';

export default class FollowPath extends ECS.System {
  test (entity) {
    return entity.components &&
      entity.components.goal &&
      entity.components.gridPosition &&
      entity.components.movement &&
      entity.components.followPath;
  }

  enter (entity) {
    console.log("entered", entity)
  }

  update (entity) {
    // set movement vector such that it points to the next gridPosition along the path
    let {x, y} = entity.components.gridPosition;
    let currentIndex = entity.components.goalPath.path.findIndex((el) => {
      return el[0] === x && el[1] === y;
    });
    let goal;
    if (typeof entity.components.goalPath.path === 'undefined') {
      entity.components.movement.velocity = new PixiVector(0, 0);
      return;
    }
    if (entity.components.debug) {
      console.log('path index', currentIndex);
    }
    if (currentIndex === -1) {
      goal = entity.components.goalPath.path[0];
    } else if (currentIndex + 1 < entity.components.goalPath.path.length) {
      goal = entity.components.goalPath.path[currentIndex + 1];
    } else {
      goal = entity.components.goalPath.path[entity.components.goalPath.path.length - 1];
    }
    let currentWorld = entity.components.sprite.pixiSprite.position;
    currentWorld = new PixiVector(currentWorld.x, currentWorld.y);
    let goalWorld = new PixiVector(goal[0], goal[1]).toWorld();
    let direction = goalWorld.clone().subtract(currentWorld);
    if (direction.x === 0 && direction.y === 0) {
      entity.components.movement.velocity = new PixiVector(0, 0);
    } else {
      let speed = direction.normalized.multiply(entity.components.movement.maxSpeed ? entity.components.movement.maxSpeed : 500);
      if (entity.components.debug) {
        console.log("direction", speed);
        console.log("goal", goal);
      }
      entity.components.movement.velocity = speed;
    }
  }
}
