export default class Player {
  constructor (restart) {
    this.gold = 10000000;
    this.lifes = 10;
    this.score = 0;
    this.restart = restart;
  }

  deduct_life () {
    this.lifes -= 1;
    if (this.lifes <= 0) {
      this.restart();
    }
  }
};
