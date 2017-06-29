import Vector from 'vigur';

export default class PixiVector extends Vector {
  copy (other) {
    this.x = other.x;
    this.y = other.y;
  }

  clone() {
    return new PixiVector(this.x, this.y);
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
