import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

import { compare } from '../utils/index.js'

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
