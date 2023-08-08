export function detectMatchingPath(currentPath: string, paths: string[]) {
  let bestMatch = "";
  let bestMatchCount = 0;

  if (paths.includes(currentPath)) return currentPath;

  for (let i = 0; i < paths.length; i++) {
    let segments = paths[i].split("/");
    let currentSegments = currentPath.split("/");
    let count = 0;

    for (let j = 0; j < segments.length; j++) {
      if (
        segments[j] !== currentSegments[j]
        // && !segments[j].includes("[") &&
        // !segments[j].includes("]") &&
        // !segments[j].includes("*")
      ) {
        break;
      }
      count++;
    }

    if (count > bestMatchCount) {
      bestMatchCount = count;
      bestMatch = paths[i];
    }
  }

  return bestMatch;
}
