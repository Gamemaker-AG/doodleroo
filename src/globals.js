import Player from 'Player';

const globals = {
  width: 1920,
  height: 1080,
  slotCount: 16,
  zIndexes: 3
};

globals.gridOffset = 100;
globals.slotSize = (globals.height - globals.gridOffset * 2) / globals.slotCount;

globals.player = new Player();
globals.showRange = false;

globals.goalPositions = [{x: globals.slotCount / 2 - 1, y: globals.slotCount - 1}, 
  {x: globals.slotCount / 2, y: globals.slotCount - 1}]

export default globals;
