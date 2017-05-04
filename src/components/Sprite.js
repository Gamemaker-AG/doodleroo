export default {
    name: 'sprite'
};

export function hasSprite(entity) {
    return entity.components.sprite &&
        entity.components.sprite.pixiSprite;
}
