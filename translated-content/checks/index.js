import child_process from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import fm from 'front-matter'

import tracking_files from '../meta/tracking.json' with { type: 'json' }

const root = process.cwd()

process.loadEnvFile(path.resolve(root, '.env'))

const CONTENT_ROOT = path.resolve(root, process.env.CONTENT_ROOT, 'files', 'en-us')

const TRANSLATED_CONTENT_ROOT = path.resolve(root, process.env.TRANSLATED_CONTENT_ROOT, 'files', 'zh-cn')

const LOG_FILE = path.normalize(path.resolve(root, 'translated-content', 'results', 'logs.json'))

const notfound = new Set()
const outdated = new Set()

for (const slug of tracking_files) {
  const file = slug
    .replace('::', '_doublecolon_')
    .replace(':', '_colon_')
  const SOURCE_FILE = path.normalize(path.resolve(CONTENT_ROOT, file.toLowerCase(), 'index.md'))
  const TARGET_FILE = path.normalize(path.resolve(TRANSLATED_CONTENT_ROOT, file.toLowerCase(), 'index.md'))
  console.log({ SOURCE_FILE, TARGET_FILE })

  if (!fs.existsSync(TARGET_FILE)) {
    notfound.add(slug)
    continue
  }

  const COMMAND = `git rev-list --max-count=1 HEAD -- ${SOURCE_FILE}`
  const { promise, resolve, reject } = Promise.withResolvers()
  outdated.add(promise)
  child_process.exec(COMMAND, { cwd: CONTENT_ROOT }, (err, sha) => {
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
      console.log({ sha, sourceCommit })
      const sourceCommit = data.attributes.l10n?.sourceCommit
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
