import child_process from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import fm from 'front-matter'

import tracking_files from '../meta/tracking.json' with { type: 'json' }

const root = process.cwd()

process.loadEnvFile(path.resolve(root, '.env'))

const CONTENT_ROOT = path.normalize(path.resolve(root, process.env.CONTENT_ROOT, 'files', 'en-us'))
console.log(CONTENT_ROOT)

const TRANSLATED_CONTENT_ROOT = path.normalize(path.resolve(root, process.env.TRANSLATED_CONTENT_ROOT, 'files', 'zh-cn'))
console.log(TRANSLATED_CONTENT_ROOT)

const LOG_FILE = path.normalize(path.resolve(root, 'translated-content', 'results', 'logs.json'))
console.log(LOG_FILE)

const notfound = new Set()
const outdated = new Set()

for (const slug of tracking_files) {
  const file = slug
    .replace('::', '_doublecolon_')
    .replace(':', '_colon_')
  const SOURCE_FILE = path.normalize(path.resolve(CONTENT_ROOT, file.toLowerCase(), 'index.md'))
  const TARGET_FILE = path.normalize(path.resolve(TRANSLATED_CONTENT_ROOT, file.toLowerCase(), 'index.md'))
  console.log(SOURCE_FILE, TARGET_FILE)

  if (!fs.existsSync(TARGET_FILE)) {
    notfound.add(slug)
    continue
  }

  const { promise, resolve, reject } = Promise.withResolvers()
  outdated.add(promise)
  child_process.exec(`git rev-list --max-count=1 HEAD -- ${SOURCE_FILE}`, { cwd: CONTENT_ROOT, encoding: 'utf-8' }, (err, sha) => {
    if (err != null) {
      console.trace(err)
      reject(err)
    }
    fs.readFile(TARGET_FILE, 'utf-8', (err, content) => {
      if (err != null) {
        console.trace(err)
        reject(err)
      }
      const data = fm(content)
      const sourceCommit = data.attributes.l10n?.sourceCommit
      console.log(sha, sourceCommit)
      if (sourceCommit == null || sourceCommit.trim() !== sha.trim()) {
        resolve(slug)
      } else {
        resolve()
      }
    })
  })
}

Promise.allSettled(Array.from(outdated)).then((outdated) => {
  fs.writeFileSync(
    LOG_FILE,
    JSON.stringify(
      {
        outdated: outdated.filter(v => v.status === 'fulfilled')
        .filter((v) => v.value != null)
        .map(v => v.value),
        notfound: Array.from(notfound),
      },
      null,
      2,
    ),
    'utf-8',
  )
})
