export function lerp (start, end, percent) {
  return (start + percent * (end - start));
};

export function radianLerp (start, end, percent) {
  let newEnd = end;
  let delta = end - start;

  if (delta > Math.PI) {
    newEnd = end - Math.PI * 2;
  } else if (delta < -Math.PI) {
    newEnd = end + Math.PI * 2;
  }

  return lerp(start, newEnd, percent);
};

export function random (min, max) {
  var rand = Math.random();

  if (typeof min === 'undefined') {
    return rand;
  } else if (typeof max === 'undefined') {
    if (min instanceof Array) {
      return min[Math.floor(rand * min.length)];
    } else {
      return rand * min;
    }
  } else {
    if (min > max) {
      var tmp = min;
      min = max;
      max = tmp;
    }

    return rand * (max - min) + min;
  }
};
