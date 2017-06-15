import * as PIXI from 'pixi.js';
import globals from 'globals';
import ECS from 'yagl-ecs';
import PriorityQueue from '@raymond-lam/priority-queue';

export default class Grid extends ECS.System {
  constructor () {
    super();
  }

  preUpdate () {
    this.new_grid = [];
    while (this.new_grid.push([[]]) < globals.gridSize);
  }

  test (entity) {
    return Boolean(entity.components.gridPosition);
  }

  update (entity) {
    if (entity.components.obstacle) {
      this.new_grid[entity.x][entity.y].push(entity);
    }
    if (entity.components.enemy) {
      console.log(this.findPath(entity, 10, 12));
    }
  }

  findPath (entity, goalX, goalY) {
    let frontier = new PriorityQueue([], (self, other) => {
      if (self[1] > other[1]) {
        return 1;
      }
      if (self[1] < other[1]) {
        return -1;
      } else {
        return 0;
      }
    });
    let {x, y} = entity.components.gridPosition;
    for (let pos in neighbors(x, y)) {
      frontier.enqueue([(pos, heuristic(pos, [goalX, goalY]))]);
    }
    return frontier;
  }

  postUpdate () {
    this.gird = this.new_grid;
  }
}

function heuristic(current, goal) {
  let [x, y] = current;
  let [goalX, goalY] = goal;
  return Math.abs(x - goalX) + Math.abs(y - goalY);
}

function neighbors(x, y) {
  let xs = [x - 1, x + 1].filter((x) => { return x >= 0 && x < globals.gridSize});
  let ys = [y - 1, y + 1].filter((y) => { return y >= 0 && y < globals.gridSize});
  let positions = [];
  for (let newX in xs) {
    for (let newY in ys) {
      positions.push([newX, newY]);
    }
  }
  return positions;
}
