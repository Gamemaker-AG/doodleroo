import ECS from 'yagl-ecs';
import globals from 'globals';

export default class Health extends ECS.System {
  constructor(ecs, freq) {
    super(freq);
    this.ecs = ecs;
  }

  test(entity) {
    return !!entity.components.health;
  }

  update(entity) {
    let {components: cs} = entity;
    let { topPixiSprite, pixiSprite } = entity.components.sprite;
    if (cs.sprite && pixiSprite) {
      this.updateMaskAlpha(pixiSprite, entity)
    }
    if (cs.sprite && topPixiSprite) {
      this.updateMaskAlpha(topPixiSprite, entity)
    }

    if (cs.health.health <= 0) {
      this.ecs.removeEntity(entity);
      if (cs.movement) {
        globals.player.score += 1;
      }
    }
  }

  updateMaskAlpha (pixiSprite, entity) {
    let {components: cs} = entity;
    pixiSprite.children.forEach((sprite) => {
      if (sprite.mask) {
        sprite.mask.alpha = 1 - cs.health.health / cs.health.initialHealth;
        this.updateMaskAlpha(sprite, entity)
      }
    });
  }
}
