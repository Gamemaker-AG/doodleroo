import ECS from 'yagl-ecs';

export default class UpdateGridPosition extends ECS.System {
  test (entity) {
    return (entity.components.autoUpdateGridPosition || entity.components.followPath) &&
      entity.components.gridPosition &&
      entity.components.sprite;
  }

  update (entity) {
    entity.components.gridPosition = entity.components.sprite.pixiSprite.position.toGrid();
  }
}
