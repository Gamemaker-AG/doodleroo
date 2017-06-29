const globals = {
  width: 1920,
  height: 1080,
  slotCount: 16
};

globals.gridOffset = 100;
globals.slotSize = (globals.height - globals.gridOffset * 2) / globals.slotCount;

export default globals;
