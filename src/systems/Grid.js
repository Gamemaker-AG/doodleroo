import * as PIXI from 'pixi.js';
import globals from 'globals';
import ECS from 'yagl-ecs';
import PixiVector from 'PixiVector';
import PriorityQueue from '@raymond-lam/priority-queue';

export default class Grid extends ECS.System {
  constructor (freq) {
    super(freq);
    let newObj = () => { return {};};
    this.towers = initializedArray(globals.slotCount, globals.slotCount, newObj, newObj);
  }

  enter (entity) {
    if (entity.components.gridPosition && entity.components.obstacle) {
      this.towers[entity.components.gridPosition.x][entity.components.gridPosition.y][entity.id] = entity;
    }
  }

  exit (entity) {
    if (entity.components.gridPosition && entity.components.obstacle) {
      delete this.towers[entity.gridPosition.x][entity.gridPostion.y][entity.id];
    }
  }

  preUpdate () {
    this.calculatePaths = [];
    this.costs = initializedArray(globals.slotCount, globals.slotCount, 1.0);
    setCosts(this.costs, this.towers);
    this.pathFinder = new Pathfinder(this.costs)
  }

  buildPathCache () {
  }

  test (entity) {
    return Boolean(entity.components.gridPosition);
  }

  update (entity) {
    let avoidAttacks = true;
    if (entity.components.obstacle) {
      return;
    }
    if (!entity.components.enemy) {
      return;
    }
    if (entity.components.goal) {
      let {x, y} = entity.components.goal;
      let path = this.findPath(entity, x, y);
      if (typeof(entity.components.goalPath) === 'undefined') {
        entity.addComponent('goalPath', {
          path: path
        });
      } else {
        entity.components.goalPath.pathUpdated = true;
        entity.components.goalPath.path = path;
      }
      entity.components.goalPath.pathUpdated = true;
    }
  }

  findPath (entity, goalX, goalY) {
    let startX = entity.components.gridPosition.x;
    let startY = entity.components.gridPosition.y;
    return this.pathFinder.findPath(startX, startY)
  }
};


// Single sink shortest path finder
class Pathfinder {
  constructor (input_costs) {
    let {cost, prev} = Pathfinder._buildFinders(input_costs, globals.goalPositions).reduce(mergePathCaches)
    this.costs = cost;
    this.prev = prev;
  }

  findPath(x, y) {
    let path = [];
    while (this.prev[x][y] !== "goal") {
      if (this.prev[x][y] === null) {
        return undefined
      }
      path.push([x, y])
      if (this.prev[x][y] !== null) {
        [x, y] = this.prev[x][y];
      } else {
        return undefined;
      }
    }
    path.push([x, y])
    return path;
  }
}

function mergePathCaches(a, b) {
  for (let x = 0; a < a.length; x++) {
    for (let x = 0; a < a.length; x++) {
      if (a.costs[x][y] >= b.costs[x][y]) {
        a.prev[x][y] = b.prev[x][y]
      }
    }
  }
  return a
}

Pathfinder._buildFinders = function (costs, goalPositions) {
  let path_finder = [];
  for (let start of goalPositions) {
    let frontier = buildFrontier();
    frontier.enqueue([[start.x, start.y], 1]);
    let costs_acc = initializedArray(globals.slotCount, globals.slotCount, Infinity, Infinity);
    let previous = initializedArray(globals.slotCount, globals.slotCount, null, null);

    costs_acc[start.x][start.y] = 1;
    previous[start.x][start.y] = "goal"

    let current;
    let i = 0;
    let prev;
    while (prev = frontier.dequeue()) {
      let [[prevX, prevY], _] = prev;
      for (let current of neighbors(prevX, prevY)) {
        let potential_new_costs = costs_acc[prevX][prevY] + costs[current[0]][current[1]]
        if (costs_acc[current[0]][current[1]] > potential_new_costs) {
          previous[current[0]][current[1]] = [prevX, prevY];
          costs_acc[current[0]][current[1]] = potential_new_costs;
          frontier.enqueue([[current[0], current[1]], costs_acc[current[0], current[1]]])
        }
      }
    }
    path_finder.push({prev: previous, cost: costs_acc});
  }
  return path_finder;
}

function alreadyVisited (pos, visited) {
  return typeof visited.find((visitedPosition) => {
      return pos[0] == visitedPosition[0] &&
        pos[1] == visitedPosition[1];
    }) !== 'undefined';
}

function heuristic (current, goal) {
  let [x, y] = current;
  let [goalX, goalY] = goal;
  return Math.abs(x - goalX) + Math.abs(y - goalY);
}

function neighbors (x, y) {
  let xs = [x - 1, x + 1].filter((x) => {
    return x >= 0 && x < globals.slotCount;});
  let ys = [y - 1, y + 1].filter((y) => {
    return y >= 0 && y < globals.slotCount;});
  let positions = [];
  for (let newX of xs) {
    positions.push([newX, y]);
  }
  for (let newY of ys) {
    positions.push([x, newY]);
  }
  return positions;
}

function setCosts(costs, towers) {
  for (let x = 0; x < towers.length; x++) {
    for (let y = 0; y < towers[x].length; y++) {
      for (let id of Object.keys(towers[x][y])) {
        let entity = towers[x][y][id];
        let { gridPosition } = entity.components
        updateAttackablePositions(costs, entity);
        costs[gridPosition.x][gridPosition.y] += entity.components.obstacle.cost;
      }
    }
  }
}

function updateAttackablePositions (costs, entity) {
  let range = entity.components.range.range;
  let { gridPosition } = entity.components;
  let x_lower = Math.floor(Math.max(gridPosition.x - range, 0));
  let y_lower = Math.floor(Math.max(gridPosition.y - range, 0));
  let x_upper = Math.ceil(Math.min(gridPosition.x + range, globals.slotCount - 1));
  let y_upper = Math.ceil(Math.min(gridPosition.y + range, globals.slotCount - 1));
  for (let x = x_lower; x <= x_upper; x++) {
    for (let y = y_lower; y <= y_upper; y++) {
      let slot_pos = new PixiVector(x, y);
      let tower_pos = entity.components.sprite.pixiSprite.position.toGrid();
      let distance = slot_pos.distance(tower_pos);
      if (distance <= entity.components.range.range) {
        if (entity.components.purchased) {
          costs[x][y] += entity.components.purchased.cost / entity.components.range.range;
        }
      }
    }
  }
  return costs;
}

function buildFrontier() {
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
  return frontier;
}

function initializedArray (xSize, ySize, value, edgeValue = Infinity) {
  let generateValue = value;
  let generateEdgeValue = edgeValue;
  if (typeof(value) !== 'function') {
    generateValue = () => value;
  }
  if (typeof(edgeValue) !== 'function') {
    generateEdgeValue = () => edgeValue;
  }

  let len = 0;
  let result = [];
  for (let y = 0; y < ySize; y++) {
    let row = [];
    for (let x = 0; x < xSize; x++) {
      if (x === xSize - 1 || x === 0 || y === ySize -1 || y === 0) {
        row.push(generateEdgeValue());
      } else {
        row.push(generateValue());
      }
    }
    result.push(row);
  }
  return result;
}

