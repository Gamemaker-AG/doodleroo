import ECS from 'yagl-ecs';

export default class Attack extends ECS.System {
  constructor () {
    super();
    this.enemies = {};
  }

  test (entity) {
    return (entity.components.enemy && entity.components.sprite) ||
      (entity.components.range && entity.components.attack && entity.components.sprite);
  }

  enter (entity) {
    if (entity.components.enemy) this.enemies[entity.id] = entity;
  }

  exit (entity) {
    if (entity.components.enemy) delete this.enemies[entity.id];
  }

  update (entity) {
    let { range, attack, sprite } = entity.components;
    if (range && attack) {
      let {position: pos} = sprite.pixiSprite;
      for (let enemy of Object.values(this.enemies)) {
        let {position: enemyPos} = enemy.components.sprite.pixiSprite;
        if (pos.distance(enemyPos) <= range.range &&
          attack.timeSinceLastAttack >= (1 / attack.rate)) {
          console.log('he attac');
          attack.timeSinceLastAttack = 0;
        }
      }

      attack.timeSinceLastAttack += window.dt;
    }
  }
}
