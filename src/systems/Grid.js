import * as PIXI from 'pixi.js';
import globals from 'globals';
import ECS from 'yagl-ecs';
import PriorityQueue from '@raymond-lam/priority-queue';

export default class Grid extends ECS.System {
  constructor () {
    super();
  }

  preUpdate () {
    this.costs = [];
    let len = 0;
    do {
      let arr = [];
      arr.fill(0.0, 0, globals.slotCount);
      len = this.costs.push(arr);
    } while (len < globals.slotCount);
  }

  test (entity) {
    return Boolean(entity.components.gridPosition);
  }

  update (entity) {
    if (entity.components.gridPosition.obstacle_cost) {
      this.cost[entity.x][entity.y] += (entity.gridPosition.obstacle_cost);
    }
    if (entity.components.enemy) {
      let path = this.findPath(entity, 12, 2);
      entity.addComponent('goalPath', {
        path: path
      });
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
    let startX = entity.components.gridPosition.x;
    let startY = entity.components.gridPosition.y;

    frontier.enqueue([[[startX, startY]], 1 + heuristic([startX, startY], [goalX, goalY])]);

    let current = undefined;
    while (current = frontier.dequeue()) {
      if (current === undefined) {
        return undefined;
      } else {
        let [x, y] = current[0][current[0].length - 1];
        let path = current[0];
        for (let pos of neighbors(x, y)) {
          if (pos[0] === goalX && pos[1] === goalY) {
            return path.concat([[goalX, goalY]]);
          }
          frontier.enqueue([path.concat([pos]), path.length + heuristic(pos, [goalX, goalY])]);
        }
      }
    }
  }

  postUpdate () {
    this.gird = this.new_grid;
  }
}

function heuristic (current, goal) {
  let [x, y] = current;
  let [goalX, goalY] = goal;
  return Math.abs(x - goalX) + Math.abs(y - goalY);
}

function neighbors (x, y) {
  let xs = [x - 1, x + 1].filter((x) => { return x >= 0 && x < globals.slotCount; });
  let ys = [y - 1, y + 1].filter((y) => { return y >= 0 && y < globals.slotCount; });
  let positions = [];
  for (let newX of xs) {
    positions.push([newX, y]);
  }
  for (let newY of ys) {
    positions.push([x, newY]);
  }
  return positions;
}
