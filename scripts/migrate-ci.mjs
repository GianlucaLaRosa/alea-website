/**
 * Esegue `payload migrate` in CI/non-TTY rispondendo "sì" al prompt dev-push.
 * Su Vercel `CI=1` fa sì che `prompts` usi il default (no) e salti le migrazioni.
 */
import { spawnSync } from 'node:child_process'

const result = spawnSync('pnpm', ['exec', 'payload', 'migrate'], {
  env: {
    ...process.env,
    CI: '',
    NODE_OPTIONS: process.env.NODE_OPTIONS || '--no-deprecation',
  },
  input: 'y\n',
  stdio: ['pipe', 'inherit', 'inherit'],
  encoding: 'utf-8',
})

process.exit(result.status === null ? 1 : result.status)
