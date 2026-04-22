export function sortObjectKeys<T extends Record<string, unknown>>(
  obj: T,
  compareFn?: (a: string, b: string) => number
): T {
  return Object.keys(obj)
    .sort(compareFn)
    .reduce((sorted, key) => {
      (sorted as Record<string, unknown>)[key] = obj[key];
      return sorted;
    }, {} as T);
}
