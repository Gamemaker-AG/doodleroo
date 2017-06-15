import ECS from 'yagl-ecs';
import Sprite from 'components/Sprite.js';
import globals from 'globals';

export default function createMenuEntities () {
  let entities = [];

	entities.push(buttonNewGameEntity(globals.width / 2, globals.height / 2 - 100));
	entities.push(buttonCreditsEntity(globals.width / 2, globals.height / 2 + 100));

  return entities;
}

function buttonNewGameEntity (x, y) {
  let entity = spriteEntity(x, y, 'button_newGame');
  entity.components.sprite.pixiSprite.anchor.set(0.5, 0.5);
  entity.addComponent('button', { action: () => {
    console.log('This should start the game.');
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

function spriteEntity (x, y, img_name) {
  let entity = new ECS.Entity(null, [Sprite]);
  let sprite = entity.components.sprite;
  sprite.pixiSprite = new PIXI.Sprite(PIXI.loader.resources[img_name].texture);
  sprite.pixiSprite.position.set(x, y);
  return entity;
}
