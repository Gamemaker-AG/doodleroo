import ECS from 'yagl-ecs';
import PixiVector from 'PixiVector';
import globals from 'globals';

export default class Heal extends ECS.System {
  constructor (towers, freq) {
    super(freq);
    this.obstacles = towers;
  }

  test (entity) {
    return !!entity.components.heal;
  }

  enter (entity) {
    entity.components.heal.timeSinceLastHeal = 1 / entity.components.heal.rate;
  }

  update (entity) {
    let { heal } = entity.components;

    if (heal.timeSinceLastHeal >= (1 / heal.rate)) {
      forEachObstacle(this.obstacles, obstacle => {
        if (obstacle.components.health && entity !== obstacle) {
          let pos = new PixiVector(entity.components.sprite.pixiSprite.x, entity.components.sprite.pixiSprite.y);
          let towerPos = new PixiVector(obstacle.components.sprite.pixiSprite.x, obstacle.components.sprite.pixiSprite.y);

          if (pos.distance(towerPos) <= entity.components.range.range * globals.slotSize) {
            obstacle.components.health.health += entity.components.heal.amount;
          }
        }
      });

      heal.timeSinceLastHeal = 0;
    }

    heal.timeSinceLastHeal += window.dt;
  }
};

function forEachObstacle (obstacles, fn) {
  obstacles.forEach(row => row.forEach(cell => Object.values(cell).forEach(fn)));
}
