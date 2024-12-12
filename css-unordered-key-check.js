import fs from 'node:fs'

import data from './mdn-data/index.js'

import { compare } from './utils.js'

const at_rule_data = data['css']['atRules']
const function_data = data['css']['functions']
const property_data = data['css']['properties']
const selector_data = data['css']['selectors']
const syntax_data = data['css']['syntaxes']
const type_data = data['css']['types']
const unit_data = data['css']['units']
const l10n_data = data['l10n']['css']

const unordered_data = []

let previous_at_rule
for (const at_rule in at_rule_data) {
  if (previous_at_rule != null) {
    if (compare(previous_at_rule, at_rule) === 1) {
      unordered_data.push(`${previous_at_rule} - ${at_rule}`)
    }
  }
  previous_at_rule = at_rule

  if (at_rule_data[at_rule]['descriptors'] != null) {
    const descriptors = at_rule_data[at_rule]['descriptors']

    let previous_at_rule_descriptor
    for (const descriptor in descriptors) {
      if (previous_at_rule_descriptor != null) {
        if (compare(previous_at_rule_descriptor, descriptor) === 1) {
          unordered_data.push(`${at_rule}/${previous_at_rule_descriptor} - ${at_rule}/${descriptor}`)
        }
      }
      previous_at_rule_descriptor = descriptor
    }
  }
}

let previous_function
for (const func in function_data) {
  if (previous_function != null) {
    if (compare(previous_function, func) === 1) {
      unordered_data.push(`${previous_function} - ${func}`)
    }
  }
  previous_function = func
}

let previous_property
for (const property in property_data) {
  if (previous_property != null) {
    if (compare(previous_property, property) === 1) {
      unordered_data.push(`${previous_property} - ${property}`)
    }
  }
  previous_property = property
}

let previous_selector
for (const selector in selector_data) {
  if (previous_selector != null) {
    if (compare(previous_selector, selector) === 1) {
      unordered_data.push(`${previous_selector} - ${selector}`)
    }
  }
  previous_selector = selector
}

let previous_syntax
for (const syntax in syntax_data) {
  if (previous_syntax != null) {
    if (compare(previous_syntax, syntax) === 1) {
      unordered_data.push(`${previous_syntax} - ${syntax}`)
    }
  }
  previous_syntax = syntax
}

let previous_type
for (const type in type_data) {
  if (previous_type != null) {
    if (compare(previous_type, type) === 1) {
      unordered_data.push(`${previous_type} - ${type}`)
    }
  }
  previous_type = type
}

let previous_unit
for (const unit in unit_data) {
  if (previous_unit != null) {
    if (compare(previous_unit, unit) === 1) {
      unordered_data.push(`${previous_unit} - ${unit}`)
    }
  }
  previous_unit = unit
}

let previous_l10n
for (const [key] of Object.entries(l10n_data)) {
  if (previous_l10n != null) {
    if (compare(previous_l10n, key) === 1) {
      unordered_data.push(`${previous_l10n} - ${key}`)
    }
  }
  previous_l10n = key
}

fs.writeFileSync('./results/unordered_data.json', JSON.stringify({ unordered_data }, null, 2))
