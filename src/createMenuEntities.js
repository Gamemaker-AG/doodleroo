import globals from 'globals';
import { buttonMuteEntity } from 'entities/ui';
import spriteEntity from 'entities/spriteEntity';
import Button from 'components/Button';

export default function createMenuEntities (newGame, backgroundMusic) {
  let entities = [];

  entities.push(spriteEntity(0, 0, 'logo'));
  entities.push(buttonNewGameEntity(globals.width / 2, globals.height / 2 - 100, newGame));
  entities.push(buttonCreditsEntity(globals.width / 2, globals.height / 2 + 100));
  entities.push(buttonMuteEntity(globals.width - 150, 100, backgroundMusic));


  return entities;
};

function buttonNewGameEntity (x, y, newGame) {
  let entity = spriteEntity(x, y, 'button_newGame');
  entity.components.sprite.pixiSprite.anchor.set(0.5, 0.5);
  entity.addComponent(Button, {
    actions: {
      'click': () => {
        newGame();
      }
    }
  });
  return entity;
}

function buttonCreditsEntity (x, y) {
  let entity = spriteEntity(x, y, 'button_credits');
  entity.components.sprite.pixiSprite.anchor.set(0.5, 0.5);
  entity.addComponent(Button, {
    actions: {
      'click': () => {
        console.log('This should open the credits.');
      }
    }
  });
  return entity;
}
