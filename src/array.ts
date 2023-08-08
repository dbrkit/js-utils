export function sortBy(
  arr: any[],
  key: string,
  direction: "asc" | "desc" = "asc"
) {
  const sortOrder = direction === "desc" ? -1 : 1;
  return arr.sort((a, b) => sortOrder * (a[key] > b[key] ? 1 : -1));
}

export const containsAll = (arr1: any[], arr2: any[]) =>
  arr2.every((arr2Item) => arr1.includes(arr2Item));

export const equals = (arr1: any[], arr2: any[]) =>
  containsAll(arr1, arr2) && containsAll(arr2, arr1);
