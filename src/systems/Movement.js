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
        console.log('adding movement', velocity);
      }

      if (entity.components.movement.slowDuration == 0) {
        entity.components.movement.speedFactor = 1;
      } else {
        entity.components.movement.slowDuration -= window.dt;

        if (entity.components.movement.slowDuration < 0) {
          entity.components.movement.slowDuration = 0;
        }
      }

      pixiSprite.position.add(velocity.multiply(entity.components.movement.speedFactor).multiply(window.dt));
    }

    if (angularVelocity !== undefined) {
      pixiSprite.rotation += angularVelocity * window.dt;
    }
  }
};
