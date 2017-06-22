import ECS from 'yagl-ecs';
import Sprite from 'components/Sprite.js';
import globals from 'globals';
import Button from 'components/Button';
import GridPosition from 'components/GridPosition';
import * as actions from 'button-actions';
import Vector from 'vigur';
import Player from 'Player';

const {gridSize} = globals;
const slotSize = globals.height / gridSize;
const towers = [
  [100, 100, 'tower_weak'],
  [100, 300, 'tower_strong'],
  [100, 500, 'tower_long'],
  [100, 500, 'tower_long']
];
let constructionMenu;

const enemies = [
  [100, 100, 'tower_weak']
];

const deg2rad = 0.0174532925;

export default function createGameEntities (addEntity) {
  let entities = [];

  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      entities.push(slotEntity(x, y));
    }
  }

  entities = entities.concat(towers.map(specs => towerEntity(specs)));
  entities = entities.concat(enemies.map(specs => enemyEntity(specs)));

  constructionMenu = constructionMenuEntity(addEntity);
  entities.push(constructionMenu);

  return entities;
};

function toWorldCoords (gridPosition) {
  return {
    x: gridPosition.x * slotSize,
    y: gridPosition.y * slotSize
  };
}

function enemyEntity (specs) {
  let entity = spriteEntity(...specs);
  entity.components.sprite.pixiSprite.anchor.set(0.5, 0.5);
  entity.addComponent('gridPosition', {x: 1, y: 1});
  entity.addComponent('enemy');
  return entity;
}

function towerEntity (specs) {
  let entity = spriteEntity(...specs);
  entity.components.sprite.pixiSprite.anchor.set(0.5, 0.5);
  entity.addComponent('range', {range: 210, visibility: true, color: 0xFF0000});
  return entity;
}

function constructionMenuEntity (addEntity) {
  let entity = new ECS.Entity(null, [Sprite, GridPosition]);
  entity.components.sprite.pixiSprite = new PIXI.Container();
  entity.components.sprite.pixiSprite.visible = false;

  let background = new PIXI.Sprite(PIXI.loader.resources['circular_background'].texture);
  background.anchor.set(0.5, 0.5);
  background.position.set(0, 0);
  background.alpha = 0.5;
  entity.components.sprite.pixiSprite.addChild(background);

  let angle = 360 / towers.length;

  let children = towers.forEach((specs, index) => {
    let sprite = new PIXI.Sprite(PIXI.loader.resources[specs[2]].texture);
    sprite.anchor.set(0.5, 0.5);
    sprite.position.set(80 * Math.cos(angle * index * deg2rad), 90 * Math.sin(angle * index * deg2rad));
    sprite.interactive = true;
    sprite.click = () => {
      let worldCoords = toWorldCoords(entity.components.gridPosition);
      let updatedSpecs = [
        worldCoords.x + slotSize / 2,
        worldCoords.y + slotSize / 2,
        specs[2]
      ];
      addEntity(towerEntity(updatedSpecs));
      entity.components.sprite.pixiSprite.visible = false;
    };
    entity.components.sprite.pixiSprite.addChild(sprite);
  });

  return entity;
}

function slotEntity (x, y) {
  let worldX = slotSize / 2 + x * slotSize;
  let worldY = slotSize / 2 + y * slotSize;
  let worldPos = new PIXI.Point(worldX, worldY);
  let entity = spriteEntity(worldX, worldY, 'slot');
  let {pixiSprite} = entity.components.sprite;
  pixiSprite.anchor.set(0.5, 0.5);
  pixiSprite.scale.set(slotSize / pixiSprite.texture.height);

  entity.addComponent('button', { action: () => {
      let {pixiSprite} = constructionMenu.components.sprite;
      let hasMoved = !worldPos.equals(pixiSprite.position);
      if (!hasMoved && pixiSprite.visible) {
        pixiSprite.visible = false;
      } else {
        pixiSprite.visible = true;
        pixiSprite.position.set(worldX, worldY);
        constructionMenu.components.gridPosition.x = x;
        constructionMenu.components.gridPosition.y = y;
      }
      if (y > gridSize / 2) {
        pixiSprite.scale.y = -1;
      } else {
        pixiSprite.scale.y = 1;
      }
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
