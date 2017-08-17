import ECS from 'yagl-ecs';
import { hasSprite } from 'components/Sprite';

export default class Movement extends ECS.System {
  test (entity) {
    return hasSprite(entity) && entity.components.movement;
  }

  update (entity) {
    let {pixiSprite} = entity.components.sprite;
    let {velocity, angularVelocity} = entity.components.movement;
    if (entity.components.debug) {
      console.log("adding movment", velocity);
    }
    if (typeof velocity !== 'undefined') {
      pixiSprite.position.set(
        pixiSprite.position.x + velocity.x * window.dt, pixiSprite.position.y + velocity.y * window.dt
      );
    }
    if (angularVelocity !== undefined) {
      pixiSprite.rotation += angularVelocity * window.dt;
    }
  }
}
