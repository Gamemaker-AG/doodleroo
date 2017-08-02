import ECS from 'yagl-ecs';
import Sprite from 'components/Sprite.js';
import globals from 'globals';

export function buttonMuteEntity (x, y) {
  let entity = spriteEntity(x, y, 'button_soundEnabled');
  entity.components.sprite.pixiSprite.anchor.set(0.5, 0.5);

  let sprite = new PIXI.Sprite(PIXI.loader.resources['button_soundDisabled'].texture);
  sprite.anchor.set(0.5, 0.5);
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

export function infoPanelEntity (x, y) {
  let entity = new ECS.Entity(null, [Sprite]);
  entity.components.sprite.pixiSprite = new PIXI.Container();
  entity.components.sprite.pixiSprite.position.set(globals.width - 800, 100);

  let style = {fontFamily: 'Arial', fontSize: 50, fill: 0xFF0000, align: 'center'};

  let coin = new PIXI.Sprite(PIXI.loader.resources['coin'].texture);
  coin.anchor.set(0.5, 0.5);
  coin.position.set(0, 0);

  let gold = new PIXI.Text(globals.player.gold, style);
  gold.anchor.set(0, 0.5);
  gold.position.set(30, 0);

  let heart = new PIXI.Sprite(PIXI.loader.resources['heart'].texture);
  heart.anchor.set(0.5, 0.5);
  heart.position.set(0, 75);
  heart.scale.set(1.5);

  let lives = new PIXI.Text(globals.player.lives, style);
  lives.anchor.set(0, 0.5);
  lives.position.set(30, 75);

  entity.components.sprite.pixiSprite.addChild(gold);
  entity.components.sprite.pixiSprite.addChild(lives);
  entity.components.sprite.pixiSprite.addChild(coin);
  entity.components.sprite.pixiSprite.addChild(heart);

  entity.addComponent('infoPanelUpdater');

  return entity;
};

export function spriteEntity (x, y, img_name) {
  let entity = new ECS.Entity(null, [Sprite]);
  let sprite = entity.components.sprite;
  sprite.pixiSprite = new PIXI.Sprite(PIXI.loader.resources[img_name].texture);
  sprite.pixiSprite.position.set(x, y);
  return entity;
};
