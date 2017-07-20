import PixiVector from 'PixiVector';

export default class ObservablePixiVector extends PixiVector {
  constructor (cb, scope, x = 0, y = 0) {
    this._x = x;
    this._y = y;

    this.cb = cb;
    this.scope = scope;
  }

  set (x, y) {
    const _x = x || 0;
    const _y = y || ((y !== 0) ? _x : 0);

    if (this._x !== _x || this._y !== _y) {
      this._x = _x;
      this._y = _y;
      this.cb.call(this.scope);
    }
  }

  copy (point) {
    if (this._x !== point.x || this._y !== point.y) {
      this._x = point.x;
      this._y = point.y;
      this.cb.call(this.scope);
    }
  }

  get x () {
    return this._x;
  }

  set x (value) {
    if (this._x !== value) {
      this._x = value;
      this.cb.call(this.scope);
    }
  }

  get y () {
    return this._y;
  }

  set y (value) {
    if (this._y !== value) {
      this._y = value;
      this.cb.call(this.scope);
    }
  }
}
