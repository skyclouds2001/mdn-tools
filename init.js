import child_process from 'node:child_process'

child_process.execSync('npm ci')

child_process.execSync('git clone https://github.com/mdn/content.git ./node_modules/@mdn/content')
