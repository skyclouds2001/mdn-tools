/**
 * this check ensures that every css function must both presented in syntaxes.json and functions.json, and both should have the same syntax
 *
 * results will be produced in ../results/inconsistent_function.json
 */

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

import data from '../@mdn/data/index.js'

const root = process.cwd()

const l10n_data = data['l10n']['css']

const missing_l10n = new Set()

for (const [key, value] of Object.entries(l10n_data)) {
  if (!Object.keys(value).includes('zh-CN')) {
    missing_l10n.add(key)
  }
}

fs.writeFileSync(
  path.resolve(root, 'results/missing_l10n.json'),
  JSON.stringify({
    missing_l10n: {
      'zh-CN': Array.from(missing_l10n),
    },
  }, null, 2),
)
