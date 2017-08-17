import ECS from 'yagl-ecs';
import {hasSprite} from 'components/Sprite';

export default class FadeOut extends ECS.System {
  constructor(ecs, freq) {
    super(freq);
    this.ecs = ecs;
  }

  test(entity) {
      return !!entity.components.fadeOut && hasSprite(entity);
  }

  update(entity) {
      let {pixiSprite} = entity.components.sprite;
      pixiSprite.alpha = pixiSprite.alpha - (entity.components.fadeOut.factor * window.dt);

      if (pixiSprite.alpha < 0.01) {
        this.ecs.removeEntity(entity);
      }
  }
}
