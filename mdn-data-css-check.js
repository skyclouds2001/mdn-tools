import fs from 'node:fs'

import bcd from '@mdn/browser-compat-data' with { type: 'json' }
import data from 'mdn-data'

import mismatch_status_ignores from './ignores/mismatch_status.json' with { type: 'json' }
import not_in_bcd_ignores from './ignores/not_in_bcd.json' with { type: 'json' }
import missing_mdn_url_ignores from './ignores/missing_mdn_url.json' with { type: 'json' }
import mismatch_mdn_url_ignores from './ignores/mismatch_mdn_url.json' with { type: 'json' }

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
const l10n_data = data['l10n']['css']

const mismatch_status = []
const not_in_bcd = []
const missing_mdn_url = []
const mismatch_mdn_url = []
const missing_l10n = []

const mismatch_statuses = Object.keys(mismatch_status_ignores)
const not_in_bcds = Object.keys(not_in_bcd_ignores)
const missing_mdn_urls = Object.keys(missing_mdn_url_ignores)
const mismatch_mdn_urls = Object.keys(mismatch_mdn_url_ignores)

for (const at_rule in at_rule_data) {
  if (at_rule_data[at_rule]['mdn_url'] == null) {
    missing_mdn_url.push(at_rule)
  } else if (at_rule_data[at_rule]['mdn_url'] !== `https://developer.mozilla.org/docs/Web/CSS/${at_rule}`) {
    mismatch_mdn_url.push(at_rule)
  }

  if (at_rule_bcd[at_rule.replace(/^@/, '')] != null) {
    const { result, actual, expected } = compare_status(at_rule_bcd[at_rule.replace(/^@/, '')], at_rule_data[at_rule])

    if (!result) {
      mismatch_status.push({
        data: at_rule,
        actual,
        expected,
      })
    }

    if (at_rule_data[at_rule]['descriptors'] != null) {
      const descriptors = at_rule_data[at_rule]['descriptors']

      for (const descriptor in descriptors) {
        // todo: mdn_url check not enabled with CSS at-rule descriptors
        // if (at_rule_data[at_rule]['descriptors'][descriptor]['mdn_url'] == null) {
        //   missing_mdn_url.push(at_rule)
        // } else if (at_rule_data[at_rule]['descriptors'][descriptor]['mdn_url'] !== `https://developer.mozilla.org/docs/Web/CSS/${at_rule}/${descriptor}`) {
        //   mismatch_mdn_url.push(`${at_rule}/${descriptor}`)
        // }

        if (at_rule_bcd[at_rule.replace(/^@/, '')][descriptor] != null) {
          const { result, actual, expected } = compare_status(at_rule_bcd[at_rule.replace(/^@/, '')][descriptor], at_rule_data[at_rule]['descriptors'][descriptor])

          if (!result) {
            mismatch_status.push({
              data: `${at_rule}/${descriptor}`,
              actual,
              expected,
            })
          }
        } else {
          not_in_bcd.push(`${at_rule}/${descriptor}`)
        }
      }
    }
  } else {
    not_in_bcd.push(at_rule)
  }
}

for (const property in property_data) {
  if (property_data[property]['mdn_url'] == null) {
    missing_mdn_url.push(property)
  } else if (property_data[property]['mdn_url'] !== `https://developer.mozilla.org/docs/Web/CSS/${property}`) {
    mismatch_mdn_url.push(property)
  }

  if (property_bcd[property] != null) {
    const { result, actual, expected } = compare_status(property_bcd[property], property_data[property])

    if (!result) {
      mismatch_status.push({
        data: property,
        actual,
        expected,
      })
    }
  } else {
    not_in_bcd.push(property)
  }
}

for (const selector in selector_data) {
  if (selector_data[selector]['mdn_url'] == null) {
    missing_mdn_url.push(selector)
  } else if (selector_data[selector]['mdn_url'] !== `https://developer.mozilla.org/docs/Web/CSS/${selector.replaceAll(' ', '_')}`) {
    mismatch_mdn_url.push(selector)
  }

  if (selector_bcd[selector.replace(/^::?/, '').replace(/\(\)$/, '')] != null) {
    const { result, actual, expected } = compare_status(selector_bcd[selector.replace(/^::?/, '').replace(/\(\)$/, '')], selector_data[selector])

    if (!result) {
      mismatch_status.push({
        data: selector,
        actual,
        expected,
      })
    }
  } else {
    not_in_bcd.push(selector)
  }
}

for (const func in function_data) {
  if (function_data[func]['mdn_url'] == null) {
    missing_mdn_url.push(func)
  }
  // todo: mdn_url check not enabled with CSS functions
  // else if (function_data[func]['mdn_url'] !== `https://developer.mozilla.org/docs/Web/CSS/${func}`) {
  //   mismatch_mdn_url.push(func)
  // }

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
  } else {
    not_in_bcd.push(func)
  }
}

for (const type in type_data) {
  if (type_data[type]['mdn_url'] == null) {
    missing_mdn_url.push(type)
  } else if (type_data[type]['mdn_url'] !== `https://developer.mozilla.org/docs/Web/CSS/${type}`) {
    mismatch_mdn_url.push(type)
  }

  if (type_bcd[type] != null || type_bcd['image'][type] != null) {
    const { result, actual, expected } = compare_status(type_bcd[type] ?? type_bcd['image'][type], type_data[type])

    if (!result) {
      mismatch_status.push({
        data: type,
        actual,
        expected,
      })
    }
  } else {
    not_in_bcd.push(type)
  }
}

for (const unit in unit_data) {
  // todo: mdn_url check not enabled with CSS units
  // if (unit_data[unit]['mdn_url'] == null) {
  //   missing_mdn_url.push(unit)
  // } else if (unit_data[unit]['mdn_url'] !== `https://developer.mozilla.org/docs/Web/CSS/${unit}`) {
  //   mismatch_mdn_url.push(unit)
  // }

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
  } else {
    not_in_bcd.push(unit)
  }
}

for (const [key, value] of Object.entries(l10n_data)) {
  if (!Object.keys(value).includes('zh-CN')) {
    missing_l10n.push(key)
  }
}

fs.writeFileSync('./results/mismatch_status.json', JSON.stringify(Object.fromEntries(mismatch_status.filter(feature => !mismatch_statuses.includes(feature)).map(({ data, actual, expected }) => ([data, { actual, expected }]))), null, 2))

fs.writeFileSync('./results/not_in_bcd.json', JSON.stringify(Object.fromEntries(not_in_bcd.filter(feature => !not_in_bcds.includes(feature)).map(feature => ([feature, '']))), null, 2))

fs.writeFileSync('./results/missing_mdn_url.json', JSON.stringify(Object.fromEntries(missing_mdn_url.filter(feature => !missing_mdn_urls.includes(feature)).map(feature => ([feature, '']))), null, 2))

fs.writeFileSync('./results/mismatch_mdn_url.json', JSON.stringify(Object.fromEntries(mismatch_mdn_url.filter(feature => !mismatch_mdn_urls.includes(feature)).map(feature => ([feature, '']))), null, 2))

fs.writeFileSync('./results/missing_l10n.json', JSON.stringify(Object.fromEntries(missing_l10n.map(feature => ([feature, '']))), null, 2))


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
