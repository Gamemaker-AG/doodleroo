export default {
  name: 'attack',
  defaults: {
    rate: 1,
    timeSinceLastAttack: 0,
    damage: 50,
    unitToAttack: null,
    bulletType: 'bullet' // 'laser', 'bullet', 'batarang'
  }
};
