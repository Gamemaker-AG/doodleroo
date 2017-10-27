import ECS from 'yagl-ecs';
import Sprite from 'components/Sprite.js';
import globals from 'globals';
import * as actions from 'button-actions';
import spriteEntity from 'entities/spriteEntity';

export function buttonMuteEntity (x, y, music) {
  let entity = spriteEntity(x, y, 'button_soundSpeaker');
  entity.components.sprite.pixiSprite.anchor.set(0.5, 0.5);
  console.log(window.localStorage.getItem('Muted'));
  music.volume = window.localStorage.getItem('Muted') == 1 ? 1 : 0;
  entity.addComponent('muteButton', {
    music: music
  });

  let sprite = new PIXI.Sprite(PIXI.loader.resources['button_soundWaves'].texture);
  sprite.anchor.set(0.5, 0.5);
  sprite.position.set(50, 0);
  sprite.visible = false;

  entity.components.sprite.pixiSprite.addChild(sprite);
  entity.addComponent('button', {
    actions: {
      'click': () => {
        console.log('toggle mute here');
        entity.components.muteButton.music.volume = entity.components.muteButton.music.volume == 1 ? 0 : 1;
      }
    }
  });

  return entity;
};

export function showRangesEntity (x, y) {
  let entity = spriteEntity(x, y, 'button_hideRanges');
  entity.components.sprite.pixiSprite.anchor.set(0.5, 0.5);

  let sprite = new PIXI.Sprite(PIXI.loader.resources['button_showRanges'].texture);
  sprite.anchor.set(0.5, 0.5);
  sprite.position.set(0, 0);
  sprite.visible = false;

  entity.components.sprite.pixiSprite.addChild(sprite);
  entity.addComponent('button', {
    actions: {
      'click': [actions.TOGGLE_SHOW_RANGES_ALL, sprite]
    }
  });

  return entity;
};

export function speedUpEntity (x, y) {
  let entity = spriteEntity(x, y, 'button_slow');
  entity.components.sprite.pixiSprite.anchor.set(0.5, 0.5);

  let sprite = new PIXI.Sprite(PIXI.loader.resources['button_fast'].texture);
  sprite.anchor.set(0.5, 0.5);
  sprite.position.set(0, 0);
  sprite.visible = false;

  entity.components.sprite.pixiSprite.addChild(sprite);
  entity.addComponent('button', {
    actions: {
      'click': () => {
        window.speed = (window.speed % 2) + 1;
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

  let style = {font: '72px fak'};

  let coin = new PIXI.Sprite(PIXI.loader.resources['coin'].texture);
  coin.anchor.set(0.5, 0.5);
  coin.position.set(0, 0);

  let gold = new PIXI.extras.BitmapText(globals.player.gold.toString(), style);
  gold.anchor.set(0, 0.5);
  gold.position.set(50, 0);

  let heart = new PIXI.Sprite(PIXI.loader.resources['heart'].texture);
  heart.anchor.set(0.5, 0.5);
  heart.position.set(0, 75);

  let lifes = new PIXI.extras.BitmapText(globals.player.lifes.toString(), style);
  lifes.anchor.set(0, 0.5);
  lifes.position.set(50, 75);

  entity.components.sprite.pixiSprite.addChild(gold);
  entity.components.sprite.pixiSprite.addChild(lifes);
  entity.components.sprite.pixiSprite.addChild(coin);
  entity.components.sprite.pixiSprite.addChild(heart);

  entity.addComponent('infoPanelUpdater');

  return entity;
};
