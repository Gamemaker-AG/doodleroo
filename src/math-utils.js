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
