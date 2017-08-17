import ECS from 'yagl-ecs';
import { hasSprite } from 'components/Sprite';

export default class Movement extends ECS.System {
  test (entity) {
    return hasSprite(entity) && entity.components.movement;
  }

  update (entity) {
    let {pixiSprite} = entity.components.sprite;
    let {velocity, angularVelocity} = entity.components.movement;
    if (typeof velocity !== 'undefined') {
      if (entity.components.debug) {
        console.log("adding movement", velocity);
      }
      pixiSprite.position.add(velocity.multiply(window.dt))
      // pixiSprite.position.set(
      //   pixiSprite.position.x + velocity.x * window.dt, pixiSprite.position.y + velocity.y * window.dt
      // );
    }
    if (angularVelocity !== undefined) {
      pixiSprite.rotation += angularVelocity * window.dt;
    }
  }
}
