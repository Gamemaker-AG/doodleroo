import ECS from 'yagl-ecs';
import { hasSprite } from 'components/Sprite';

export default class Movement extends ECS.System {
  test (entity) {
    return hasSprite(entity) && entity.components.movement;
  }

  update (entity) {
    let {pixiSprite} = entity.components.sprite;
    let {velocity, angularVelocity} = entity.components.movement;
    if (velocity !== undefined) {
      pixiSprite.position.set(
        pixiSprite.position.x + velocity.x * dt, pixiSprite.position.y + velocity.y * dt
      );
    }
    if (angularVelocity !== undefined) {
      pixiSprite.rotation += angularVelocity * dt;
    }
  }
}
