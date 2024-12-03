import child_process from 'node:child_process'

child_process.execSync('npm ci')

child_process.execSync('git clone https://github.com/mdn/content.git ./node_modules/@mdn/content')

child_process.execSync('git clone https://github.com/mdn/browser-compat-data.git ./node_modules/@mdn/browser-compat-data')

child_process.execSync('git clone https://github.com/mdn/data.git ./node_modules/mdn-data')
