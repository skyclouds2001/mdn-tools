import child_process from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

import tracking_files from '../meta/tracking.json' with { type: 'json' }

const root = process.cwd()

const CONTENT_REPO_ROOT = path.resolve(root, '@mdn/content')

const TRANSLATED_CONTENT_REPO_ROOT = path.resolve(root, '@mdn/translated-content')

const CONTENT_ROOT = path.resolve(CONTENT_REPO_ROOT, 'files/en-us')

const TRANSLATED_CONTENT_ROOT = path.resolve(TRANSLATED_CONTENT_REPO_ROOT, 'files/zh-cn')

const LOG_FILE = path.resolve(root, 'translated-content/results/logs.json')

const logs = new Set()

for (const tracking_file of tracking_files) {
  const SOURCE_FILE = path.resolve(CONTENT_ROOT, tracking_file.toLowerCase(), 'index.md')
  const TARGET_FILE = path.resolve(TRANSLATED_CONTENT_ROOT, tracking_file.toLowerCase(), 'index.md')
  const sha = child_process.execSync(`git rev-list --max-count=1 HEAD -- ${SOURCE_FILE}`, { cwd: CONTENT_ROOT }).toString('utf-8')
  if (!fs.readFileSync(TARGET_FILE, 'utf-8').includes(sha)) {
    logs.add(tracking_file)
  }
}

fs.writeFileSync(LOG_FILE, JSON.stringify(Array.from(logs)), 'utf-8')
