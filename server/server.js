const { execSync } = require('child_process')

const port = process.env.PORT || 3001
execSync(`npx json-server db.json --port ${port} --host 0.0.0.0`, { stdio: 'inherit' })
