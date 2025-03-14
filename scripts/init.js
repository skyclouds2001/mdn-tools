import child_process from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()

child_process.execSync('npm ci', {
  cwd: root,
})

if (!fs.existsSync(path.resolve(root, '@mdn/data')) || !fs.existsSync(path.resolve(root, '@mdn/browser-compat-data')) || !fs.existsSync(path.resolve(root, '@mdn/content'))) {
  child_process.execSync('git submodule init', {
    cwd: root,
  })
}
