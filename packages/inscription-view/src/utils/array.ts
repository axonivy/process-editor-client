export function indexOf<TArr>(array: TArr[], find: (obj: TArr) => boolean): number {
  const cond = array.find(find);
  if (cond) {
    return array.indexOf(cond);
  }
  return -1;
}

export function arraymove<TArr>(arr: TArr[], fromIndex: number, toIndex: number) {
  const element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
}
