import { spawn } from 'node:child_process'

const port = process.env.PORT ?? '3000'
const npxCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx'

const child = spawn(npxCommand, ['vite', 'preview', '--host', '0.0.0.0', '--port', port], {
  stdio: 'inherit',
})

child.on('exit', (code) => {
  process.exit(code ?? 0)
})
