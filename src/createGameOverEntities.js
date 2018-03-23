import ECS from 'yagl-ecs';
import globals from 'globals';
import spawner from 'components/Spawner';
import gridPosition from 'components/GridPosition';
import * as actions from 'button-actions';
import constructionMenuEntity from 'entities/constructionMenu';
import PixiVector from 'PixiVector';
import spriteEntity from 'entities/spriteEntity';
import textEntity from 'entities/textEntity';
import Sprite from 'components/Sprite.js';
import Button from 'components/Button';

export default function createGameOverEntities (newGame, score) {
  let style = {font: '72px fak', stroke: '#4286f4'};

  let scoreText = `You scored a total of ${score} points.`
  let scoreTextEntity = textEntity(globals.width / 2, globals.height / 3, scoreText, style);
  
  let buttonEntity = spriteEntity(globals.width / 2, globals.height / 4 * 3, 'button_default');
  buttonEntity.components.sprite.pixiSprite.anchor.set(0.5, 0.5);
  let buttonText = new PIXI.extras.BitmapText('restart game', style);
  buttonText.anchor.set(0.5, 0.5);
  buttonText.position.set(0, -20)
  buttonEntity.components.sprite.pixiSprite.addChild(buttonText);

  buttonEntity.addComponent(Button, {
    actions: {
      'click': () => {
        newGame();
      },
      'mouseover': [actions.MOUSE_OVER_IMAGE, buttonEntity, 'button_mouseover'],
      'mouseout': [actions.MOUSE_EXIT_IMAGE, buttonEntity, 'button_default'],
      'mousedown': [actions.MOUSE_DOWN_IMAGE, buttonEntity, 'button_pressed']
    }
  });
  return [buttonEntity, scoreTextEntity];
}
