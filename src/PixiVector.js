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
    return new PixiVector(this.x * slotSize + slotSize / 2,
      this.y * slotSize + slotSize / 2);
  }

  toGrid () {
    let slotSize = globals.slotSize;
    let x = Math.floor(this.x / slotSize);
    let y = Math.floor(this.y / slotSize);
    return new PixiVector(x, y);
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
