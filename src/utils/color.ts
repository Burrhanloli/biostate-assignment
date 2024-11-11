export function getColorBasedOnLength(value: string) {
  if (value.length >= 7) {
    return "red";
  }
  if (value.length >= 5) {
    return "orange";
  }
  if (value.length >= 3) {
    return "amber";
  }
  return "blue";
}
