import ECS from 'yagl-ecs';
import Sprite from 'components/Sprite.js';
import GridPosition from 'components/GridPosition';
import PixiVector from 'PixiVector';
import globals from 'globals';
import { tower_types } from 'entities/towers';
import ZIndex from 'components/ZIndex';

const {slotCount, slotSize} = globals;

export default function constructionMenuEntity (addEntity) {
  let entity = new ECS.Entity(null, [Sprite, GridPosition, ZIndex]);
  entity.components.zIndex.index = 1;
  entity.components.sprite.pixiSprite = new PIXI.Container();
  entity.components.sprite.pixiSprite.visible = false;

  let background = new PIXI.Sprite(PIXI.loader.resources['circular_background'].texture);
  background.anchor.set(0.5, 0.5);
  background.position.set(0, 0);
  background.scale.set(0.7);
  background.alpha = 0.5;
  entity.components.sprite.pixiSprite.addChild(background);

  let angle = (Math.PI * 2) / tower_types.length;

  tower_types.forEach((tower, index) => {
    let pos = new PixiVector(background.height / 2, 0).rotate((angle * index) - Math.PI / 2);
    let towerEntity = tower.factory(pos.x, pos.y);

    if (towerEntity.components.purchased.cost > globals.player.gold) {
      towerEntity.components.sprite.pixiSprite.alpha = 0.5;
    }

    let clickaction = () => {
      let worldCoords = entity.components.sprite.pixiSprite.position;

      if (towerEntity.components.purchased.cost <= globals.player.gold) {
        console.log('Constructing at:',
          entity.components.gridPosition.x,
          entity.components.gridPosition.y
        );

        addEntity(tower.factory(worldCoords.x, worldCoords.y));
      }

      entity.components.sprite.pixiSprite.visible = false;
    };

    towerEntity.components.sprite.pixiSprite.click = clickaction;
    towerEntity.components.sprite.pixiSprite.on('tap', clickaction);

    entity.components.sprite.pixiSprite.addChild(towerEntity.components.sprite.pixiSprite);
  });

  return entity;
};
