import ECS from 'yagl-ecs';
import Sprite from 'components/Sprite.js';

export function buttonMuteEntity (x, y) {
  let entity = spriteEntity(x, y, 'button_soundEnabled');
  // entity.components.sprite.pixiSprite.anchor.set(0.5, 0.5)

  let sprite = new PIXI.Sprite(PIXI.loader.resources['button_soundDisabled'].texture);
  // sprite.anchor.set(0.5, 0.5)
  sprite.position.set(0, 0);
  sprite.visible = false;

  entity.components.sprite.pixiSprite.addChild(sprite);
  entity.addComponent('button', {
    actions: {
      'click': () => {
        console.log('toggle mute here');
        sprite.visible = !sprite.visible;
      }
    }
  });
  return entity;
};

function spriteEntity (x, y, img_name) {
  let entity = new ECS.Entity(null, [Sprite]);
  let sprite = entity.components.sprite;
  sprite.pixiSprite = new PIXI.Sprite(PIXI.loader.resources[img_name].texture);
  sprite.pixiSprite.position.set(x, y);
  return entity;
}
