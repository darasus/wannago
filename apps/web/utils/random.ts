export function random<T>(list: T[]): T {
  var idx = -1;
  var len = list.length;
  var position;
  var result: T[] = [];

  while (++idx < len) {
    position = Math.floor((idx + 1) * Math.random());
    result[idx] = result[position];
    result[position] = list[idx];
  }
  return result[0];
}
