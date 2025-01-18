/**
 * this check ensures that every data in every json file must be ordered by alphabet ordering
 *
 * ignores are placed in ../ignores/unordered_data.json
 * results will be produced in ../results/unordered_data.json
 */

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

import data from '../@mdn/data/index.js'

import { compare } from '../utils/index.js'

import definitions from '../@mdn/data/css/definitions.json' with { type: 'json' }

import ignores from '../ignores/unordered_data.json' with { type: 'json' }

const root = process.cwd()

const at_rule_data = data['css']['atRules']
const function_data = data['css']['functions']
const property_data = data['css']['properties']
const selector_data = data['css']['selectors']
const syntax_data = data['css']['syntaxes']
const type_data = data['css']['types']
const unit_data = data['css']['units']
const l10n_data = data['l10n']['css']

const unordered_data = new Map()

let previous_definition
for (const definition in definitions) {
  if (previous_definition != null && ignores[previous_definition] !== definition && compare(previous_definition, definition) === 1) {
    unordered_data.set(previous_definition, definition)
  }
  previous_definition = definition
}

let previous_at_rule
for (const at_rule in at_rule_data) {
  if (previous_at_rule != null && ignores[previous_at_rule] !== at_rule && compare(previous_at_rule, at_rule) === 1) {
    unordered_data.set(previous_at_rule, at_rule)
  }
  previous_at_rule = at_rule

  if (at_rule_data[at_rule]['descriptors'] != null) {
    const at_rule_descriptors = at_rule_data[at_rule]['descriptors']

    let previous_at_rule_descriptor
    for (const at_rule_descriptor in at_rule_descriptors) {
      if (previous_at_rule_descriptor != null && ignores[previous_at_rule_descriptor] !== at_rule_descriptor && compare(previous_at_rule_descriptor, at_rule_descriptor) === 1) {
        unordered_data.set(`${at_rule}/${previous_at_rule_descriptor}`, `${at_rule}/${at_rule_descriptor}`)
      }
      previous_at_rule_descriptor = at_rule_descriptor
    }
  }
}

let previous_function
for (const func in function_data) {
  if (previous_function != null && ignores[previous_function] !== func && compare(previous_function, func) === 1) {
    unordered_data.set(previous_function, func)
  }
  previous_function = func
}

let previous_property
for (const property in property_data) {
  if (previous_property != null && ignores[previous_property] !== property && compare(previous_property, property) === 1) {
    unordered_data.set(previous_property, property)
  }
  previous_property = property
}

let previous_selector
for (const selector in selector_data) {
  if (previous_selector != null && ignores[previous_selector] !== selector && compare(previous_selector, selector) === 1) {
    unordered_data.set(previous_selector, selector)
  }
  previous_selector = selector
}

let previous_syntax
for (const syntax in syntax_data) {
  if (previous_syntax != null && ignores[previous_syntax] !== syntax && compare(previous_syntax, syntax) === 1) {
    unordered_data.set(previous_syntax, syntax)
  }
  previous_syntax = syntax
}

let previous_type
for (const type in type_data) {
  if (previous_type != null && ignores[previous_type] !== type && compare(previous_type, type) === 1) {
    unordered_data.set(previous_type, type)
  }
  previous_type = type
}

let previous_unit
for (const unit in unit_data) {
  if (previous_unit != null && ignores[previous_unit] !== unit && compare(previous_unit, unit) === 1) {
    unordered_data.set(previous_unit, unit)
  }
  previous_unit = unit
}

let previous_l10n
for (const [l10n] of Object.entries(l10n_data)) {
  if (previous_l10n != null && ignores[previous_l10n] !== l10n && compare(previous_l10n, l10n) === 1) {
    unordered_data.set(previous_l10n, l10n)
  }
  previous_l10n = l10n
}

fs.writeFileSync(
  path.resolve(root, 'results/unordered_data.json'),
  JSON.stringify({
    unordered_data: Object.fromEntries(unordered_data),
  }, null, 2),
)
