import ECS from 'yagl-ecs';
import globals from 'globals';
import PixiVector from 'PixiVector';
import { radianLerp } from 'math-utils';

export default class TargetInRange extends ECS.System {
  constructor(obstacles, freq) {
    super(freq);
    this.enemies = {};
    this.obstacles = obstacles;
  }

  test (entity) {
    return (entity.components.enemy && entity.components.sprite) ||
      (entity.components.range && entity.components.attack && entity.components.sprite);
  }

  enter (entity) {
    if (entity.components.enemy) {
      this.enemies[entity.id] = entity;
    }
  }

  exit (entity) {
    if (entity.components.enemy) {
      delete this.enemies[entity.id];

      forEachTower(this.obstacles, tower => {
        if (tower.components) {
          let {attack} = tower.components;
          if (attack && attack.unitToAttack === entity) {
            attack.unitToAttack = null;
          }
        }
      });
    }
  }

  update(entity) {
    let { range, attack, sprite } = entity.components;

    if (range && attack) {
      let {position: pos} = sprite.pixiSprite;
      let unitInRange;

      if (attack.unitToAttack && inRange(entity, attack.unitToAttack)) {
        unitInRange = attack.unitToAttack;
      } else {
        unitInRange = Object.values(this.enemies).find(enemy => inRange(entity, enemy));
      }

      if (unitInRange) {
        let {position: unitToAttackPos} = unitInRange.components.sprite.pixiSprite;
        let posVec = new PixiVector(pos.x, pos.y);
        let enemyPosVec = new PixiVector(unitToAttackPos.x, unitToAttackPos.y);

        let currentRotation = (sprite.pixiSprite.children.length === 0) ? sprite.pixiSprite.rotation : sprite.pixiSprite.getChildAt(0).rotation;
        let targetRotation = (enemyPosVec.clone().subtract(posVec)).horizontalAngle;
        let rotationSpeed = 3;
        let rotationDiff = Math.abs(currentRotation - targetRotation);

        if (rotationDiff <= 0.1) {
          attack.unitToAttack = unitInRange;
        }


        let lerpRotation = radianLerp(currentRotation, targetRotation, rotationSpeed * window.dt);
        if (sprite.pixiSprite.children.length === 0) {
          sprite.pixiSprite.rotation = lerpRotation;
        } else {
          sprite.pixiSprite.getChildAt(0).rotation = lerpRotation;
        }
      } else {
        attack.unitToAttack = null;
      }
    }
  }
}

function inRange(tower, enemy) {
  let effectiveRange = tower.components.range.range * globals.slotSize;
  let {position} = tower.components.sprite.pixiSprite;
  let {position: enemyPos} = enemy.components.sprite.pixiSprite;

  return position.distance(enemyPos) <= effectiveRange;
}

function forEachTower(towers, fn) {
  towers.forEach(row => row.forEach(cell => Object.values(cell).forEach(fn)));
}
