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

const function_data = data['css']['functions']
const syntax_data = data['css']['syntaxes']

const not_in_syntax = new Set()
const not_in_function = new Set()
const mismatch_syntax_between_function_and_syntax = new Set()

const functions = Object.keys(function_data)
const syntaxes = Object.keys(syntax_data)

for (const func in function_data) {
  if (!syntaxes.includes(func)) {
    not_in_syntax.add(func)
  } else {
    if (function_data[func]['syntax'] !== syntax_data[func]['syntax']) {
      mismatch_syntax_between_function_and_syntax.add(func)
    }
  }
}

for (const syntax in syntax_data) {
  if (syntax.endsWith('()') && !functions.includes(syntax)) {
    not_in_function.add(syntax)
  }
}

fs.writeFileSync(
  path.resolve(root, 'results/inconsistent_function.json'),
  JSON.stringify({
    inconsistent_function: {
      not_in_syntax: Array.from(not_in_syntax),
      not_in_function: Array.from(not_in_function),
      mismatch_syntax_between_function_and_syntax: Array.from(mismatch_syntax_between_function_and_syntax),
    },
  }, null, 2),
)
