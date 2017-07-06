import ECS from 'yagl-ecs';
import Sprite from 'components/Sprite.js';
import globals from 'globals';
import Button from 'components/Button';
import * as actions from 'button-actions';

export default function createMenuEntities (newGame) {
  let entities = [];

  entities.push(buttonNewGameEntity(globals.width / 2, globals.height / 2 - 100, newGame));
  entities.push(buttonCreditsEntity(globals.width / 2, globals.height / 2 + 100));
  entities.push(buttonMuteEntity(globals.width - 100, 100));

  return entities;
};

function buttonNewGameEntity (x, y, newGame) {
  let entity = spriteEntity(x, y, 'button_newGame');
  entity.components.sprite.pixiSprite.anchor.set(0.5, 0.5);
  entity.addComponent('button', { action: () => {
      newGame();
  }});
  return entity;
}

function buttonCreditsEntity (x, y) {
  let entity = spriteEntity(x, y, 'button_credits');
  entity.components.sprite.pixiSprite.anchor.set(0.5, 0.5);
  entity.addComponent('button', { action: () => {
      console.log('This should open the credits.');
  }});
  return entity;
}

function buttonMuteEntity (x, y) {
  let entity = spriteEntity(x, y, 'button_soundEnabled');
  entity.components.sprite.pixiSprite.anchor.set(0.5, 0.5);

  let sprite = new PIXI.Sprite(PIXI.loader.resources['button_soundDisabled'].texture);
  sprite.anchor.set(0.5, 0.5);
  sprite.position.set(0, 0);
  sprite.visible = false;

  entity.components.sprite.pixiSprite.addChild(sprite);
  entity.addComponent('button', {
    action: actions.TOGGLE_SHOW_RANGES
  });
  return entity;
}

function spriteEntity (x, y, img_name) {
  let entity = new ECS.Entity(null, [Sprite]);
  let sprite = entity.components.sprite;
  sprite.pixiSprite = new PIXI.Sprite(PIXI.loader.resources[img_name].texture);
  sprite.pixiSprite.position.set(x, y);
  return entity;
}
