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

      if (entity.components.movement.poisonDuration > 0) {
        entity.components.health.health *= 1 - (entity.components.movement.poisonAmount * window.dt);
        entity.components.movement.poisonDuration -= window.dt;
      } else {
        entity.components.movement.poisonDuration = 0;
      }

      if (entity.components.movement.slowDuration > 0) {
        entity.components.movement.slowDuration -= window.dt;
      } else {
        entity.components.movement.slowDuration = 0;
        entity.components.movement.speedFactor = 1;
      }

      if (entity.components.movement.poisonDuration > 0 && entity.components.movement.slowDuration > 0) {
        pixiSprite.tint = (0x728C00 - 0xB2DFEE) / 0x000002;
      } else if (entity.components.movement.poisonDuration > 0) {
        pixiSprite.tint = 0xEEDDFF;
      } else if (entity.components.movement.slowDuration > 0) {
        pixiSprite.tint = 0xB2DFEE;
      } else {
        pixiSprite.tint = 0xFFFFFF;
      }

      // if poisoned --> green tint
      // if slowed   --> blue tint
      // if both     --> cyan tint

      // if (entity.components.movement.slowDuration == 0) {
      //   entity.components.sprite.pixiSprite.tint = '0xFFFFFF'
      //   entity.components.movement.speedFactor = 1
      // } else {
      //   entity.components.sprite.pixiSprite.tint = '0xB2DFEE'
      //   entity.components.movement.slowDuration -= window.dt

      //   if (entity.components.movement.slowDuration < 0) {
      //     entity.components.movement.slowDuration = 0
      //   }
      // }

      pixiSprite.position.add(velocity.multiply(entity.components.movement.speedFactor).multiply(window.dt));
    }

    if (angularVelocity !== undefined) {
      pixiSprite.rotation += angularVelocity * window.dt;
    }
  }
};
