/**
 * this check ensures that every feature should have a correct mdn_url key
 *
 * results will be produced in ../results/incorrect_mdn_url.json
 */

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

import bcd from '../@mdn/browser-compat-data/build/data.json' with { type: 'json' }
import data from '../@mdn/data/index.js'

import bcd_data_redirect from '../data/bcd-data-redirect.json' with { type: 'json' }

const root = process.cwd()

const at_rule_data = data['css']['atRules']
const at_rule_bcd = bcd['css']['at-rules']
const function_data = data['css']['functions']
const function_bcd = bcd['css']['types']
const property_data = data['css']['properties']
const property_bcd = bcd['css']['properties']
const selector_data = data['css']['selectors']
const selector_bcd = bcd['css']['selectors']
const type_data = data['css']['types']
const type_bcd = bcd['css']['types']
const unit_data = data['css']['units']
const unit_bcd = bcd['css']['types']

const missing_in_bcd = new Set()
const missing_in_data = new Set()

for (const at_rule in at_rule_data) {
  if (at_rule_bcd[at_rule.replace(/^@/, '')] == null) {
    missing_in_bcd.add(at_rule)
  }

  if (at_rule_data[at_rule]['descriptors'] != null) {
    const at_rule_descriptors = at_rule_data[at_rule]['descriptors']

    for (const at_rule_descriptor in at_rule_descriptors) {
      if (at_rule_bcd[at_rule.replace(/^@/, '')][at_rule_descriptor] == null) {
        missing_in_bcd.add(`${at_rule}/${at_rule_descriptor}`)
      }
    }
  }
}

for (const func in function_data) {
  if (
    function_bcd[func.replace(/\(\)$/, '')] == null &&
    function_bcd['basic-shape'][func.replace(/\(\)$/, '')] == null &&
    function_bcd['filter-function'][func.replace(/\(\)$/, '')] == null &&
    function_bcd['transform-function'][func.replace(/\(\)$/, '')] == null &&
    function_bcd['color'][func.replace(/\(\)$/, '')] == null &&
    function_bcd['image'][func.replace(/\(\)$/, '')] == null &&
    function_bcd['gradient'][func.replace(/\(\)$/, '')] == null &&
    bcd['css']['properties']['animation-timeline'][func.replace(/\(\)$/, '')] == null &&
    bcd['css']['properties']['grid-template-columns'][func.replace(/\(\)$/, '')] == null &&
    bcd['css']['properties']['custom-property'][func.replace(/\(\)$/, '')] == null
  ) {
    missing_in_bcd.add(func)
  }
}

for (const property in property_data) {
  if (property_bcd[property] == null) {
    missing_in_bcd.add(property)
  }
}

for (const selector in selector_data) {
  if (selector_bcd[selector.replace(/^::?/, '').replace(/\(\)$/, '')] == null) {
    missing_in_bcd.add(selector)
  }
}

for (const type in type_data) {
  if (type_bcd[type] == null && type_bcd['image'][type] == null) {
    missing_in_bcd.add(type)
  }
}

for (const unit in unit_data) {
  if (
    unit_bcd['length'][unit] == null &&
    unit_bcd['resolution'][unit] == null &&
    unit_bcd['angle'][unit] == null
  ) {
    missing_in_bcd.add(unit)
  }
}

for (const at_rule in at_rule_bcd) {
  if (bcd_data_redirect['at-rules'][at_rule] != null && at_rule_data[bcd_data_redirect['at-rules'][at_rule]] != null) {
    continue
  }

  if (at_rule_data['@' + at_rule] != null) {
    continue
  }

  missing_in_data.add('@' + at_rule)
}

for (const property in property_bcd) {
  if (bcd_data_redirect['properties'][property] != null && property_data[bcd_data_redirect['properties'][property]] != null) {
    continue
  }

  if (property_data[property] != null) {
    continue
  }

  missing_in_data.add(property)
}

for (const selector in selector_bcd) {
  if (bcd_data_redirect['selectors'][selector] != null && selector_data[bcd_data_redirect['selectors'][selector]] != null) {
    continue
  }

  if (selector_data[selector] != null) {
    continue
  }

  if (selector_data['::' + selector] != null) {
    continue
  }

  if (selector_data[':' + selector] != null) {
    continue
  }

  missing_in_data.add(selector_bcd[selector]['__compat']['description'].replace('<code>', '').replace('</code>', ''))
}

for (const type in type_bcd) {
  if (bcd_data_redirect['types'][type] != null && type_data[bcd_data_redirect['types'][type]] != null) {
    continue
  }

  if (type_data[type] != null) {
    continue
  }

  missing_in_data.add(type)
}

fs.writeFileSync(
  path.resolve(root, 'results/inconsistent_bcd_data.json'),
  JSON.stringify({
    inconsistent_bcd_data: {
      'missing_in_bcd': Array.from(missing_in_bcd),
      'missing_in_data': Array.from(missing_in_data),
    },
  }, null, 2),
)
