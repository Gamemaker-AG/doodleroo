export default class Player {
  constructor () {
    this.gold = 10000;
    this.lifes = 10;
  }

  deduct_life () {
    this.lifes -= 1;
    if (this.lifes <= 0) {
      alert("You lost!")
    }
  }
}
