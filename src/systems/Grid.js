import * as PIXI from 'pixi.js';
import globals from 'globals';
import ECS from 'yagl-ecs';
import PixiVector from 'PixiVector';
import FastPriorityQueue from 'fastpriorityqueue';

export default class Grid extends ECS.System {
  constructor (freq) {
    super(freq);
    let newObj = () => { return {};};
    this.obstacles = initializedArray(globals.slotCount, globals.slotCount, newObj, newObj);
    this.dirty = true;
  }

  enter (entity) {
    let {gridPosition} = entity.components;
    if (gridPosition && entity.components.obstacle) {
      this.obstacles[gridPosition.x][gridPosition.y][entity.id] = entity;
      this.dirty = true;
    }
  }

  exit (entity) {
    let {gridPosition} = entity.components;
    if (gridPosition && entity.components.obstacle) {
      delete this.obstacles[gridPosition.x][gridPosition.y][entity.id];
      this.dirty = true;
    }
  }

  updateCosts () {
    this.costs = initializedArray(globals.slotCount, globals.slotCount, 1.0, 1.0);
    let costs = this.costs;
    let obstacles = this.obstacles;
    for (let x = 0; x < obstacles.length; x++) {
      for (let y = 0; y < obstacles[x].length; y++) {
        for (let id of Object.keys(obstacles[x][y])) {
          let entity = obstacles[x][y][id];
          let { gridPosition, range } = entity.components;
          if (range) {
            updateAttackablePositions(costs, entity);
          }
          costs[gridPosition.x][gridPosition.y] += entity.components.obstacle.cost;
        }
      }
    }
  }

  preUpdate () {
    this.updateCosts();
  }

  postUpdate () {
    if (this.dirty) {
      this.pathFinder = new Pathfinder(this.costs)
      this.dirty = false;
    }
  }

  test (entity) {
    return Boolean(entity.components.gridPosition);
  }

  update (entity) {
    if (entity.components.obstacle || !entity.components.enemy) {
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
    let {cost, prev} = Pathfinder._buildFinders(input_costs, globals.goalPositions)
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

Pathfinder._buildFinders = function (costs, goalPositions) {
  let path_finder = [];
  let frontier = buildFrontier();
  let costs_acc = initializedArray(globals.slotCount, globals.slotCount, Infinity, Infinity);
  let previous = initializedArray(globals.slotCount, globals.slotCount, null, null);
  for (let start of goalPositions) {
    frontier.add([[start.x, start.y], 1]);
    costs_acc[start.x][start.y] = 1;
    previous[start.x][start.y] = "goal"
  }

  let current;
  let i = 0;
  let prev;
  while (prev = frontier.poll()) {
    let [[prevX, prevY], _] = prev;
    for (let current of neighbors(prevX, prevY)) {
      let potential_new_costs = costs_acc[prevX][prevY] + costs[current[0]][current[1]]
      if (costs_acc[current[0]][current[1]] > potential_new_costs) {
        previous[current[0]][current[1]] = [prevX, prevY];
        costs_acc[current[0]][current[1]] = potential_new_costs;
        let current_costs = costs_acc[current[0]][current[1]];
        frontier.add([[current[0], current[1]], current_costs]);
      }
    }
  }
  return {prev: previous, cost: costs_acc};
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
  let frontier = new FastPriorityQueue((self, other) => {
    self[0] > other[0];
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
