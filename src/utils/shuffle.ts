/**
 * Fisher-Yates shuffle algorithm with guarantee of non-identity ordering when length > 1
 */
export function shuffleArray<T>(array: T[]): T[] {
  if (!array || array.length <= 1) return [...(array || [])];

  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Ensure it is not accidentally identical to the original order when length > 2
  if (shuffled.length > 2) {
    let isIdentical = true;
    for (let i = 0; i < shuffled.length; i++) {
      if (shuffled[i] !== array[i]) {
        isIdentical = false;
        break;
      }
    }
    if (isIdentical) {
      // Swap first two items
      [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
    }
  }

  return shuffled;
}
