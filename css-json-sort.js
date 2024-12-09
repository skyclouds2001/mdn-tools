import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const base = process.cwd()

const files = [
  'mdn-data/css/at-rules.json',
  'mdn-data/css/functions.json',
  'mdn-data/css/properties.json',
  'mdn-data/css/selectors.json',
  'mdn-data/css/syntaxes.json',
  'mdn-data/css/types.json',
  'mdn-data/css/units.json',
  'mdn-data/l10n/css.json',
]

for (const file of files) {
  const source = JSON.parse(
    fs.readFileSync(path.resolve(base, file)),
  )
  const result = Object.fromEntries(Object.entries(source).sort(([a], [b]) => compare(a, b)))
  fs.writeFileSync(path.resolve(base, file), JSON.stringify(result, null, 2))
}

/**
 * @param {string} a
 * @param {string} b
 * @returns {1 | 0 | -1}
 */
function compare(a, b) {
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
