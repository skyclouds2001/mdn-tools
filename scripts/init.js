import child_process from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()

child_process.execSync('npm ci', {
  cwd: root,
})

if (!fs.existsSync(path.resolve(root, '@mdn', '.gitignore'))) {
  fs.writeFileSync(path.resolve(root, '@mdn', '.gitignore'), '*', 'utf-8')
}

if (fs.existsSync(path.resolve(root, '@mdn/browser-compat-data'))) {
  child_process.execSync('git pull', {
    cwd: path.resolve(root, '@mdn/browser-compat-data'),
  })

  child_process.execSync('npm ci', {
    cwd: path.resolve(root, '@mdn/browser-compat-data'),
  })

  child_process.execSync('npm run build', {
    cwd: path.resolve(root, '@mdn/browser-compat-data'),
  })
} else {
  child_process.execSync('git clone https://github.com/mdn/browser-compat-data.git ./@mdn/browser-compat-data', {
    cwd: root,
  })
}

if (fs.existsSync(path.resolve(root, '@mdn/data'))) {
  child_process.execSync('git pull', {
    cwd: path.resolve(root, '@mdn/data'),
  })

  child_process.execSync('npm ci', {
    cwd: path.resolve(root, '@mdn/data'),
  })
} else {
  child_process.execSync('git clone https://github.com/mdn/data.git ./@mdn/data', {
    cwd: root,
  })
}

if (fs.existsSync(path.resolve(root, '@mdn/content'))) {
  child_process.execSync('git pull', {
    cwd: path.resolve(root, '@mdn/content'),
  })

  child_process.execSync('yarn', {
    cwd: path.resolve(root, '@mdn/content'),
  })
} else {
  child_process.execSync('git clone https://github.com/mdn/content.git ./@mdn/content', {
    cwd: root,
  })
}
