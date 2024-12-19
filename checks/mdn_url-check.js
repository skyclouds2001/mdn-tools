/**
 * this check ensures that every feature should have a correct mdn_url key
 *
 * results will be produced in ../results/incorrect_mdn_url.json
 */

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

import data from '../@mdn/data/index.js'

const root = process.cwd()

const at_rule_data = data['css']['atRules']
const function_data = data['css']['functions']
const property_data = data['css']['properties']
const selector_data = data['css']['selectors']
const type_data = data['css']['types']

const missing_mdn_url = new Set()
const mismatch_mdn_url = new Set()
const missing_mdn_content = new Set()

for (const at_rule in at_rule_data) {
  if (at_rule_data[at_rule]['mdn_url'] == null) {
    missing_mdn_url.add(at_rule)
  } else {
    if (at_rule_data[at_rule]['mdn_url'] !== `https://developer.mozilla.org/docs/Web/CSS/${at_rule}`) {
      mismatch_mdn_url.add(at_rule)
    }
    if (!fs.existsSync(path.resolve(root, '@mdn/content/files/en-us/web/css', at_rule))) {
      missing_mdn_content.add(at_rule)
    }
  }

  if (at_rule_data[at_rule]['descriptors'] != null) {
    const at_rule_descriptors = at_rule_data[at_rule]['descriptors']

    for (const at_rule_descriptor in at_rule_descriptors) {
      if (at_rule_data[at_rule]['descriptors'][at_rule_descriptor]['mdn_url'] == null) {
        missing_mdn_url.add(`${at_rule}/${at_rule_descriptor}`)
      } else {
        if (at_rule_data[at_rule]['descriptors'][at_rule_descriptor]['mdn_url'] !== `https://developer.mozilla.org/docs/Web/CSS/${at_rule}/${at_rule_descriptor}`) {
          mismatch_mdn_url.add(`${at_rule}/${at_rule_descriptor}`)
        }
        if (!fs.existsSync(path.resolve(root, '@mdn/content/files/en-us/web/css', at_rule, at_rule_descriptor))) {
          missing_mdn_content.add(`${at_rule}/${at_rule_descriptor}`)
        }
      }
    }
  }
}

for (const func in function_data) {
  if (function_data[func]['mdn_url'] == null) {
    missing_mdn_url.add(func)
  } else {
    if (function_data[func]['mdn_url'] !== `https://developer.mozilla.org/docs/Web/CSS/${func}`) {
      mismatch_mdn_url.add(func)
    }
    if (!fs.existsSync(path.resolve(root, '@mdn/content/files/en-us/web/css', func.replaceAll('()', '')))) {
      missing_mdn_content.add(func)
    }
  }
}

for (const property in property_data) {
  if (property_data[property]['mdn_url'] == null) {
    missing_mdn_url.add(property)
  } else {
    if (property_data[property]['mdn_url'] !== `https://developer.mozilla.org/docs/Web/CSS/${property}`) {
      mismatch_mdn_url.add(property)
    }
    if (!fs.existsSync(path.resolve(root, '@mdn/content/files/en-us/web/css', property))) {
      missing_mdn_content.add(property)
    }
  }
}

for (const selector in selector_data) {
  if (selector_data[selector]['mdn_url'] == null) {
    missing_mdn_url.add(selector)
  } else {
    if (selector_data[selector]['mdn_url'] !== `https://developer.mozilla.org/docs/Web/CSS/${selector.replaceAll(' ', '_')}`) {
      mismatch_mdn_url.add(selector)
    }
    if (!fs.existsSync(path.resolve(root, '@mdn/content/files/en-us/web/css', selector.replaceAll(' ', '_').replaceAll('::', '_doublecolon_').replaceAll(':', '_colon_')))) {
      missing_mdn_content.add(selector)
    }
  }
}

for (const type in type_data) {
  if (type_data[type]['mdn_url'] == null) {
    missing_mdn_url.add(type)
  } else {
    if (type_data[type]['mdn_url'] !== `https://developer.mozilla.org/docs/Web/CSS/${type}`) {
      mismatch_mdn_url.add(type)
    }
    if (!fs.existsSync(path.resolve(root, '@mdn/content/files/en-us/web/css', type))) {
      missing_mdn_content.add(type)
    }
  }
}

fs.writeFileSync(
  path.resolve(root, 'results/incorrect_mdn_url.json'),
  JSON.stringify({
    incorrect_mdn_url: {
      missing_mdn_url: Array.from(missing_mdn_url),
      mismatch_mdn_url: Array.from(mismatch_mdn_url),
      missing_mdn_content: Array.from(missing_mdn_content),
    },
  }, null, 2),
)
