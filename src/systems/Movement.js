import ECS from 'yagl-ecs';
import { hasSprite } from 'components/Sprite';

export default class Movement extends ECS.System {
  test (entity) {
    return hasSprite(entity) && entity.components.movement;
  }

  update (entity) {
    let {pixiSprite} = entity.components.sprite;
  
  	pixiSprite.anchor.set(0.5, 0.5)
  	pixiSprite.position.set(100, 100)
  	pixiSprite.rotation += 0.1 * dt
  }
};
