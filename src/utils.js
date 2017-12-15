export function childAt (entity, pos) {
  return entity.components.sprite.pixiSprite.getChildAt(pos);
}

export function animateImages (images) {
  if (Array.isArray(images)) {
    let textures = images.map((name) => {
      return PIXI.loader.resources[name].texture;
    })
    let animated = new PIXI.extras.AnimatedSprite(textures);
    animated.animationSpeed = 0.1
    animated.play();
    return animated
  } else {
    let sprite = new PIXI.Sprite(PIXI.loader.resources[images].texture);
    return sprite
  }
}
