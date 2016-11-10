export function desc(a, b): number {
  if (a > b) {
    return -1
  } else if (a === b) {
    return 0
  } else {
    return 1
  }
}