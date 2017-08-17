import Vector from 'vigur';
import globals from 'globals';

export default class PixiVector extends Vector {
  copy (other) {
    this.x = other.x;
    this.y = other.y;
  }

  clone () {
    return new PixiVector(this.x, this.y);
  }

  toWorld () {
    let slotSize = globals.slotSize;
    return new PixiVector(
      this.x * slotSize + slotSize / 2 + globals.gridOffset,
      this.y * slotSize + slotSize / 2 + globals.gridOffset);
  }

  toGrid () {
    let slotSize = globals.slotSize;
    let x = Math.floor((this.x - globals.gridOffset) / slotSize);
    let y = Math.floor((this.y - globals.gridOffset) / slotSize);
    return new PixiVector(x, y);
  }

  asArray() {
    return [this.x, this.y]
  }

  equals (other) {
    return this.isEqual(other);
  }

  set (x, y = null) {
    this.x = x;

    if (y !== null) {
      this.y = y;
    } else {
      this.y = x;
    }
  }
}
