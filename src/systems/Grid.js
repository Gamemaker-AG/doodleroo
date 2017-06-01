import * as PIXI from 'pixi.js';
import globals from 'globals';
import ECS from 'yagl-ecs';

export default class Grid extends ECS.System {
  constructor() {
    super();
  }

  preUpdate () {
    this.grid = [];
    while (grid.push([[]]) < gridSize);
  }

  test (entity) {
    return entity.components.girdPosition;
  }


  update (entity) {
    this.grid[entity.x][entity.y].push(entity);
  }
}
