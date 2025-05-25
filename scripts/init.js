import child_process from 'node:child_process'
import process from 'node:process'

const root = process.cwd()

child_process.execSync('npm ci --ignore-scripts', {
  cwd: root,
})

child_process.execSync('git submodule init', {
  cwd: root,
})
