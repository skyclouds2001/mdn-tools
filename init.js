import child_process from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import util from 'node:util'

init()

async function init() {
  const root = process.cwd()

  const exec = util.promisify(child_process.exec)

  await exec('npm ci', {
    cwd: root,
  }, (error) => {
    if (error != null) {
      console.log(error)
    }
  })

  if (!fs.existsSync(path.resolve(root, '@mdn', '.gitignore'))) {
    fs.writeFileSync(path.resolve(root, '@mdn', '.gitignore'), '*', 'utf-8')
  }

  if (fs.existsSync(path.resolve(root, '@mdn/browser-compat-data'))) {
    await exec('git pull', {
      cwd: path.resolve(root, '@mdn/browser-compat-data'),
    }, (error) => {
      if (error != null) {
        console.log(error)
      }
    })
  } else {
    await exec('git clone https://github.com/mdn/browser-compat-data.git ./@mdn/browser-compat-data', {
      cwd: root,
    }, (error) => {
      if (error != null) {
        console.log(error)
      }
    })
  }

  if (fs.existsSync(path.resolve(root, '@mdn/data'))) {
    await exec('git pull', {
      cwd: path.resolve(root, '@mdn/data'),
    }, (error) => {
      if (error != null) {
        console.log(error)
      }
    })
  } else {
    await exec('git clone https://github.com/mdn/data.git ./@mdn/data', {
      cwd: root,
    }, (error) => {
      if (error != null) {
        console.log(error)
      }
    })
  }

  if (fs.existsSync(path.resolve(root, '@mdn/content'))) {
    await exec('git pull', {
      cwd: path.resolve(root, '@mdn/content'),
    }, (error) => {
      if (error != null) {
        console.log(error)
      }
    })
  } else {
    await exec('git clone https://github.com/mdn/content.git ./@mdn/content', {
      cwd: root,
    }, (error) => {
      if (error != null) {
        console.log(error)
      }
    })
  }
}
