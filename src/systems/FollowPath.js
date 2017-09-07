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

  update (entity) {
    // set movement vector such that it points to the next gridPosition along the path
    let {x, y} = entity.components.gridPosition;
    let {path} = entity.components.goalPath;
    let {movement} = entity.components;
    if (typeof path === 'undefined') {
      movement.velocity = new PixiVector(0, 0);
      return;
    }
    let currentIndex = path.findIndex((el) => {
      return el[0] === x && el[1] === y;
    });
    if (entity.components.debug) {
      console.log('path index', currentIndex);
    }
    let goal;
    if (currentIndex === -1) {
      goal = path[0];
    } else if (currentIndex + 1 < path.length) {
      goal = path[currentIndex + 1];
    } else {
      goal = path[path.length - 1];
    }
    let currentWorld = entity.components.sprite.pixiSprite.position;
    let goalWorld = new PixiVector(goal[0], goal[1]).toWorld();
    let direction = goalWorld.clone().subtract(currentWorld);
    if (direction.x === 0 && direction.y === 0) {
      movement.velocity = new PixiVector(0, 0);
    } else {
      let speed = direction.normalized.multiply(movement.maxSpeed ? movement.maxSpeed : 500);
      if (entity.components.debug) {
        console.log('direction', speed);
        console.log('goal', goal);
      }
      movement.velocity = speed;
    }
  }
}
