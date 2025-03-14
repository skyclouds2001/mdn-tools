import child_process from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()

child_process.execSync('git submodule sync --recursive', {
  cwd: root,
})

child_process.execSync('git submodule update --recursive --remote', {
  cwd: root,
})

child_process.execSync('npm ci', {
  cwd: path.resolve(root, '@mdn/data'),
})

child_process.execSync('npm ci', {
  cwd: path.resolve(root, '@mdn/browser-compat-data'),
})

child_process.execSync('npm run build', {
  cwd: path.resolve(root, '@mdn/browser-compat-data'),
})

child_process.execSync('yarn', {
  cwd: path.resolve(root, '@mdn/translated-content'),
})

child_process.execSync('yarn', {
  cwd: path.resolve(root, '@mdn/content'),
})
