/**
 * this check ensures that every feature should have a correct mdn_url key and the mdn_url key must be matched with the feature, also, the mdn content referenced by the feature must be existed
 *
 * results will be produced in ../results/incorrect_mdn_url.json
 */

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

import data from '../@mdn/data/index.js'

import redirects from '../data/data-content-redirect.json' with { type: 'json' }

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
    if (at_rule_data[at_rule]['mdn_url'] !== `https://developer.mozilla.org/docs/Web/CSS/${redirects['at-rules'][at_rule] ?? at_rule}`) {
      mismatch_mdn_url.add(at_rule)
    }
    if (!fs.existsSync(path.resolve(root, '@mdn/content/files/en-us/web/css', at_rule_data[at_rule]['mdn_url'].replaceAll('https://developer.mozilla.org/docs/Web/CSS/', '')))) {
      missing_mdn_content.add(at_rule)
    }
  }

  if (at_rule_data[at_rule]['descriptors'] != null) {
    const at_rule_descriptors = at_rule_data[at_rule]['descriptors']

    for (const at_rule_descriptor in at_rule_descriptors) {
      if (at_rule_data[at_rule]['descriptors'][at_rule_descriptor]['mdn_url'] == null) {
        missing_mdn_url.add(`${at_rule}/${at_rule_descriptor}`)
      } else {
        if (at_rule_data[at_rule]['descriptors'][at_rule_descriptor]['mdn_url'] !== `https://developer.mozilla.org/docs/Web/CSS/${redirects[`${at_rule}/${at_rule_descriptor}`] ?? `${at_rule}/${at_rule_descriptor}`}`) {
          mismatch_mdn_url.add(`${at_rule}/${at_rule_descriptor}`)
        }
        if (!fs.existsSync(path.resolve(root, '@mdn/content/files/en-us/web/css', at_rule_data[at_rule]['descriptors'][at_rule_descriptor]['mdn_url'].replaceAll('https://developer.mozilla.org/docs/Web/CSS/', '')))) {
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
    if (function_data[func]['mdn_url'] !== `https://developer.mozilla.org/docs/Web/CSS/${redirects['functions'][func] ?? func.replaceAll('()', '')}`) {
      mismatch_mdn_url.add(func)
    }
    if (!fs.existsSync(path.resolve(root, '@mdn/content/files/en-us/web/css', function_data[func]['mdn_url'].replaceAll('https://developer.mozilla.org/docs/Web/CSS/', '')))) {
      missing_mdn_content.add(func)
    }
  }
}

for (const property in property_data) {
  if (property_data[property]['mdn_url'] == null) {
    missing_mdn_url.add(property)
  } else {
    if (property_data[property]['mdn_url'] !== `https://developer.mozilla.org/docs/Web/CSS/${redirects['properties'][property] ?? property}`) {
      mismatch_mdn_url.add(property)
    }
    if (!fs.existsSync(path.resolve(root, '@mdn/content/files/en-us/web/css', property_data[property]['mdn_url'].replaceAll('https://developer.mozilla.org/docs/Web/CSS/', '')))) {
      missing_mdn_content.add(property)
    }
  }
}

for (const selector in selector_data) {
  if (selector_data[selector]['mdn_url'] == null) {
    missing_mdn_url.add(selector)
  } else {
    if (selector_data[selector]['mdn_url'] !== `https://developer.mozilla.org/docs/Web/CSS/${redirects['selectors'][selector] ?? selector.replaceAll(' ', '_')}`) {
      mismatch_mdn_url.add(selector)
    }
    if (!fs.existsSync(path.resolve(root, '@mdn/content/files/en-us/web/css', selector_data[selector]['mdn_url'].replaceAll('https://developer.mozilla.org/docs/Web/CSS/', '').replaceAll('::', '_doublecolon_').replaceAll(':', '_colon_')))) {
      missing_mdn_content.add(selector)
    }
  }
}

for (const type in type_data) {
  if (type_data[type]['mdn_url'] == null) {
    missing_mdn_url.add(type)
  } else {
    if (type_data[type]['mdn_url'] !== `https://developer.mozilla.org/docs/Web/CSS/${redirects['types'][type] ?? type}`) {
      mismatch_mdn_url.add(type)
    }
    if (!fs.existsSync(path.resolve(root, '@mdn/content/files/en-us/web/css', type_data[type]['mdn_url'].replaceAll('https://developer.mozilla.org/docs/Web/CSS/', '')))) {
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
