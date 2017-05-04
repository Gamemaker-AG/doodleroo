export const NULL = Symbol('none');
export const ALERT = Symbol('alert');

export const actions = {
  [NULL]: () => {},
  [ALERT]: () => { alert('LOL'); }
};
