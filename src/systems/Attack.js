import ECS from 'yagl-ecs';
import lineShot from 'entities/lineShot';
import PixiVector from 'PixiVector';
import globals from 'globals';

export default class Attack extends ECS.System {
  constructor (ecs, enemies, freq) {
    super(freq);
    this.ecs = ecs;
	this.enemies = enemies;
  }

  test (entity) {
    return !!entity.components.attack;
  }

  update (entity) {
    let {attack} = entity.components;

    if (attack.unitToAttack &&
      attack.timeSinceLastAttack >= (1 / attack.rate)) {
      this.attack(entity, attack.unitToAttack);
      attack.timeSinceLastAttack = 0;
    }

    attack.timeSinceLastAttack += window.dt;
  }

  attack (source, enemy) {
    let {position: origin} = source.components.sprite.pixiSprite;
    let {position: target} = enemy.components.sprite.pixiSprite;
    this.ecs.addEntity(lineShot(origin, target));

    if (source.components.slow) {
      // slow
      if (source.components.slow.duration > enemy.components.movement.slowDuration) {
        enemy.components.movement.slowDuration = source.components.slow.duration;
      }

      enemy.components.movement.speedFactor = source.components.slow.speedFactor;
    } else {
      if (source.components.splash) {
        // deal splash damage
		let enemyPos = new PixiVector(target.x, target.y);
		
        for (let i in this.enemies) {
		  if (this.enemies.hasOwnProperty(i)) {
			let otherPos = new PixiVector(
              this.enemies[i].components.sprite.pixiSprite.x,
			  this.enemies[i].components.sprite.pixiSprite.y
			);
			
			if (enemyPos.clone().distance(otherPos) <= source.components.splash.splashRadius * globals.slotSize) {
				this.enemies[i].components.health.health -= source.components.attack.damage;
			}
          }
        }
      } else {
        // deal single damage
		enemy.components.health.health -= source.components.attack.damage;
      }
    }
  }
};
