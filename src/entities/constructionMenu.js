import ECS from 'yagl-ecs';
import Sprite from 'components/Sprite.js';
import GridPosition from 'components/GridPosition';
import PixiVector from 'PixiVector';
import globals from 'globals';
import { towerEntity } from 'createGameEntities';

const {slotCount, slotSize} = globals;

export default function constructionMenuEntity (addEntity, towers) {
  let entity = new ECS.Entity(null, [Sprite, GridPosition]);
  entity.components.sprite.pixiSprite = new PIXI.Container();
  entity.components.sprite.pixiSprite.visible = false;

  let background = new PIXI.Sprite(PIXI.loader.resources['circular_background'].texture);
  background.anchor.set(0.5, 0.5);
  background.position.set(0, 0);
  background.scale.set(0.7);
  background.alpha = 0.5;
  entity.components.sprite.pixiSprite.addChild(background);

  let angle = (Math.PI * 2) / towers.length;

  let children = towers.forEach((specs, index) => {
    // let sprite = new PIXI.Sprite(PIXI.loader.resources[specs[2]].texture)
    let sprite = new PIXI.Sprite(PIXI.loader.resources[specs.img].texture);
    sprite.anchor.set(0.5, 0.5);

    let pos = new PixiVector(background.height / 2, 0).rotate((angle * index) - Math.PI / 2);
    sprite.position = pos;
    sprite.interactive = true;

    if (specs.cost > globals.player.gold)
      sprite.alpha = 0.5;

    sprite.click = () => {
      let worldCoords = entity.components.sprite.pixiSprite.position;
      let updatedSpecs = [
        worldCoords.x,
        worldCoords.y,
        specs.img,
        specs.cost,
        specs.range,
        specs.damage
      ];

      if (updatedSpecs[3] <= globals.player.gold) {
        console.log('Constructing at:',
          entity.components.gridPosition.x,
          entity.components.gridPosition.y
        );
        addEntity(towerEntity(
          entity.components.gridPosition.x,
          entity.components.gridPosition.y,
          updatedSpecs));
      }

      entity.components.sprite.pixiSprite.visible = false;
    };
    entity.components.sprite.pixiSprite.addChild(sprite);
  });

  return entity;
};
