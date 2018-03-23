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

export function paperEffect (mask) {
  let paper = new PIXI.Sprite(PIXI.loader.resources['paper'].texture);
  paper.anchor.set(0.5, 0.5);
  let addFilter = new PIXI.filters.AlphaFilter();
  addFilter.blendMode = PIXI.BLEND_MODES.MULTIPLY;
  paper.filters = [addFilter];

  paper.addChild(mask);
  mask.anchor.set(0.5, 0.5);
  mask.alpha = 1
  paper.mask = mask;

  return paper
}
