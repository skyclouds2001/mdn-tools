import child_process from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()

child_process.exec('npm ci', {
  cwd: root,
}, (error) => {
  if (error != null) {
    console.log(error)
  }
})

if (fs.existsSync(path.resolve(root, '@mdn/browser-compat-data'))) {
  child_process.exec('git pull', {
    cwd: path.resolve(root, '@mdn/browser-compat-data'),
  }, (error) => {
    if (error != null) {
      console.log(error)
    }
  })
} else {
  child_process.exec('git clone https://github.com/mdn/browser-compat-data.git ./@mdn/browser-compat-data', {
    cwd: root,
  }, (error) => {
    if (error != null) {
      console.log(error)
    }
  })
}

if (fs.existsSync(path.resolve(root, 'mdn-data'))) {
  child_process.exec('git pull', {
    cwd: path.resolve(root, 'mdn-data'),
  }, (error) => {
    if (error != null) {
      console.log(error)
    }
  })
} else {
  child_process.exec('git clone https://github.com/mdn/data.git ./mdn-data', {
    cwd: root,
  }, (error) => {
    if (error != null) {
      console.log(error)
    }
  })
}
