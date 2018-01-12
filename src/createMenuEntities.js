import globals from 'globals';
import { buttonMuteEntity } from 'entities/ui';
import spriteEntity from 'entities/spriteEntity';
import Button from 'components/Button';
import * as actions from 'button-actions';

export default function createMenuEntities (newGame, backgroundMusic) {
  let entities = [];

  entities.push(spriteEntity(0, 0, 'logo'));
  entities.push(buttonNewGameEntity(globals.width / 2, globals.height / 2 - 100, newGame));
  entities.push(buttonCreditsEntity(globals.width / 2, globals.height / 2 + 100));
  entities.push(buttonMuteEntity(globals.width - 150, 100, backgroundMusic));


  return entities;
};

function buttonNewGameEntity (x, y, newGame) {
  let entity = spriteEntity(x, y, 'button_default');
  entity.components.sprite.pixiSprite.anchor.set(0.5, 0.5);
  entity.addComponent(Button, {
    actions: {
      'click': () => {
        newGame();
      },
      'mouseover': [actions.MOUSE_OVER_IMAGE, entity, 'button_mouseover'],
      'mouseout': [actions.MOUSE_EXIT_IMAGE, entity, 'button_default'],
      'mousedown': [actions.MOUSE_DOWN_IMAGE, entity, 'button_pressed']
    }
  });
  return entity;
}

function buttonCreditsEntity (x, y) {
  let entity = spriteEntity(x, y, 'button_default');
  entity.components.sprite.pixiSprite.anchor.set(0.5, 0.5);
  entity.addComponent(Button, {
    actions: {
      'click': () => {
        console.log('This should open the credits.');
      },
      'mouseover': [actions.MOUSE_OVER_IMAGE, entity, 'button_mouseover'],
      'mouseout': [actions.MOUSE_EXIT_IMAGE, entity, 'button_default'],
      'mousedown': [actions.MOUSE_DOWN_IMAGE, entity, 'button_pressed']
    }
  });
  return entity;
}
