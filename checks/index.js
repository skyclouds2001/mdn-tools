// @ts-check

import fs from 'node:fs'

import bcd from '../@mdn/browser-compat-data/build/data.json' with { type: 'json' }
import data from '../@mdn/data/index.js'

import './data-order-check.js'
import './function-consistent-check.js'
import './l10n-check.js'
import './mdn_url-check.js'
import './bcd-data-consistent-check.js'

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

const mismatch_status = []

for (const at_rule in at_rule_data) {
  if (at_rule_bcd[at_rule.replace(/^@/, '')] != null) {
    const { result, actual, expected } = compare_status(at_rule_bcd[at_rule.replace(/^@/, '')], at_rule_data[at_rule])

    if (!result) {
      mismatch_status.push({
        data: at_rule,
        actual,
        expected,
      })
    }
  }

  if (at_rule_data[at_rule]['descriptors'] != null) {
    const descriptors = at_rule_data[at_rule]['descriptors']

    for (const descriptor in descriptors) {
      if (at_rule_bcd[at_rule.replace(/^@/, '')][descriptor] != null) {
        const { result, actual, expected } = compare_status(at_rule_bcd[at_rule.replace(/^@/, '')][descriptor], at_rule_data[at_rule]['descriptors'][descriptor])

        if (!result) {
          mismatch_status.push({
            data: `${at_rule}/${descriptor}`,
            actual,
            expected,
          })
        }
      }
    }
  }
}

for (const property in property_data) {
  if (property_bcd[property] != null) {
    const { result, actual, expected } = compare_status(property_bcd[property], property_data[property])

    if (!result) {
      mismatch_status.push({
        data: property,
        actual,
        expected,
      })
    }
  }
}

for (const selector in selector_data) {
  if (selector_bcd[selector.replace(/^::?/, '').replace(/\(\)$/, '')] != null) {
    const { result, actual, expected } = compare_status(selector_bcd[selector.replace(/^::?/, '').replace(/\(\)$/, '')], selector_data[selector])

    if (!result) {
      mismatch_status.push({
        data: selector,
        actual,
        expected,
      })
    }
  }
}

for (const func in function_data) {
  if (
    function_bcd[func.replace(/\(\)$/, '')] != null ||
    function_bcd['basic-shape'][func.replace(/\(\)$/, '')] != null ||
    function_bcd['filter-function'][func.replace(/\(\)$/, '')] != null ||
    function_bcd['transform-function'][func.replace(/\(\)$/, '')] != null ||
    function_bcd['color'][func.replace(/\(\)$/, '')] != null ||
    function_bcd['image'][func.replace(/\(\)$/, '')] != null ||
    function_bcd['gradient'][func.replace(/\(\)$/, '')] != null ||
    bcd['css']['properties']['animation-timeline'][func.replace(/\(\)$/, '')] != null ||
    bcd['css']['properties']['grid-template-columns'][func.replace(/\(\)$/, '')] != null ||
    bcd['css']['properties']['custom-property'][func.replace(/\(\)$/, '')] != null
  ) {
    const { result, actual, expected } = compare_status(
      function_bcd[func.replace(/\(\)$/, '')] ??
      function_bcd['basic-shape'][func.replace(/\(\)$/, '')] ??
      function_bcd['filter-function'][func.replace(/\(\)$/, '')] ??
      function_bcd['transform-function'][func.replace(/\(\)$/, '')] ??
      function_bcd['color'][func.replace(/\(\)$/, '')] ??
      function_bcd['image'][func.replace(/\(\)$/, '')] ??
      function_bcd['gradient'][func.replace(/\(\)$/, '')] ??
      bcd['css']['properties']['animation-timeline'][func.replace(/\(\)$/, '')] ??
      bcd['css']['properties']['grid-template-columns'][func.replace(/\(\)$/, '')] ??
      bcd['css']['properties']['custom-property'][func.replace(/\(\)$/, '')],
      function_data[func]
    )

    if (!result) {
      mismatch_status.push({
        data: func,
        actual,
        expected,
      })
    }
  }
}

for (const type in type_data) {
  if (type_bcd[type] != null || type_bcd['image'][type] != null) {
    const { result, actual, expected } = compare_status(type_bcd[type] ?? type_bcd['image'][type], type_data[type])

    if (!result) {
      mismatch_status.push({
        data: type,
        actual,
        expected,
      })
    }
  }
}

for (const unit in unit_data) {
  if (
    unit_bcd['length'][unit] != null ||
    unit_bcd['resolution'][unit] != null ||
    unit_bcd['angle'][unit] != null
  ) {
    const { result, actual, expected } = compare_status(
      unit_bcd['length'][unit] ??
      unit_bcd['resolution'][unit] ??
      unit_bcd['angle'][unit],
      unit_data[unit]
    )

    if (!result) {
      mismatch_status.push({
        data: unit,
        actual,
        expected,
      })
    }
  }
}

fs.writeFileSync('./results/mismatch_status.json', JSON.stringify(Object.fromEntries(mismatch_status.map(({ data, actual, expected }) => ([data, { actual, expected }]))), null, 2))

function compare_status(bcd, data) {
  const status = bcd['__compat']['status']

  let expected = 'nonstandard'
  if (!status['standard_track']) {
    expected = 'nonstandard'
  } else if (status['deprecated']) {
    expected = 'obsolete'
  } else if (status['experimental']) {
    expected = 'experimental'
  } else if (status['standard_track']) {
    expected = 'standard'
  }

  const actual = data['status']

  return {
    result: actual === expected,
    actual,
    expected,
  }
}
