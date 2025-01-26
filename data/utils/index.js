/**
 * @param {string} a
 * @param {string} b
 * @returns {1 | 0 | -1}
 */
export function compare(a, b) {
  if (a.startsWith('-ms') && !b.startsWith('-ms')) {
    return -1
  }
  if (!a.startsWith('-ms') && b.startsWith('-ms')) {
    return 1
  }
  if (a.startsWith('::') && !b.startsWith('::')) {
    return 1
  }
  if (!a.startsWith('::') && b.startsWith('::')) {
    return -1
  }
  if (a.startsWith('::') && b.startsWith('::')) {
    if (a.startsWith('::-ms') && !b.startsWith('::-ms')) {
      return -1
    }
    if (!a.startsWith('::-ms') && b.startsWith('::-ms')) {
      return 1
    }
  }
  return a.toLowerCase() < b.toLowerCase() ? -1 : 1
}
