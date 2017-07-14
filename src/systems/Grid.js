import * as PIXI from 'pixi.js';
import globals from 'globals';
import ECS from 'yagl-ecs';
import PriorityQueue from '@raymond-lam/priority-queue';

export default class Grid extends ECS.System {
  constructor (freq) {
    super(freq);
    this.new_costs = this.initializedArray(globals.slotCount, globals.slotCount, 1.0);
  }

  initializedArray(x, y, value) {
    let len = 0;
    let result = [];
    do {
      let arr = [];
      while (arr.push([]) < globals.slotCount)
      arr.fill(value, 0, x);
      len = result.push(arr);
    } while (len < y);
    return result;
  }

  preUpdate () {
    console.time('pathfinding');
    this.calculatePaths = [];
    this.costs = this.new_costs;
    this.new_costs = this.initializedArray(globals.slotCount, globals.slotCount, 1.0);
  }

  test (entity) {
    return Boolean(entity.components.gridPosition);
  }

  update (entity) {
    if (entity.components.obstacle) {
      this.new_costs[entity.components.gridPosition.x][entity.components.gridPosition.y] += entity.components.obstacle.cost;
      return;
    }
    let path = this.findPath(entity, 12, 2);
    if (!entity.components.enemy) {
      return;
    }
    if (entity.components.goalPath === undefined) {
      entity.addComponent('goalPath', {
        path: path
      });
    } else {
      entity.path_updated = true;
      entity.components.goalPath.path = path;
    }
    entity.pathUpdated = true;
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
          };
          let cost = 0;
          for (let el of path) {
            cost += this.costs[el[0]][el[1]];
          }
          frontier.enqueue([path.concat([pos]), cost + heuristic(pos, [goalX, goalY])]);
        }
      }
    }
  }

  postUpdate () {
    this.costs = this.new_costs;
    console.timeEnd('pathfinding');
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
