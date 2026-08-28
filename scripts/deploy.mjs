// One-command deploy to Afrihost over FTP.
//   1. `npm run build` has already produced dist/
//   2. this uploads dist/ into your public_html
//
// Credentials come from a git-ignored .env file (copy .env.example → .env).
// Secrets on the server (secrets.php) are never touched — this only uploads,
// it doesn't delete remote files.

import { Client } from 'basic-ftp';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// --- tiny .env loader (no dependency, works on any Node version) ----------
const envPath = join(root, '.env');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m) process.env[m[1]] ??= m[2].replace(/^['"]|['"]$/g, '');
  }
}

const {
  FTP_HOST,
  FTP_USER,
  FTP_PASSWORD,
  FTP_PORT = '21',
  FTP_SECURE = 'true',
  FTP_REMOTE_DIR = 'public_html',
} = process.env;

if (!FTP_HOST || !FTP_USER || !FTP_PASSWORD) {
  console.error('\n✖ Missing FTP settings. Copy .env.example → .env and fill it in.\n');
  process.exit(1);
}

const distDir = join(root, 'dist');
if (!existsSync(distDir)) {
  console.error('\n✖ dist/ not found. Run `npm run build` first (or use `npm run deploy`).\n');
  process.exit(1);
}

const client = new Client(30000);
client.ftp.verbose = false;

try {
  console.log(`→ Connecting to ${FTP_HOST} as ${FTP_USER}…`);
  await client.access({
    host: FTP_HOST,
    user: FTP_USER,
    password: FTP_PASSWORD,
    port: Number(FTP_PORT),
    secure: FTP_SECURE === 'true',
    secureOptions: { rejectUnauthorized: false }, // shared hosts often use their own cert
  });

  console.log(`→ Uploading dist/ → ${FTP_REMOTE_DIR} …`);
  client.trackProgress((info) => {
    if (info.name) process.stdout.write(`   ${info.type} ${info.name}\r`);
  });
  await client.ensureDir(FTP_REMOTE_DIR);
  await client.uploadFromDir(distDir);
  client.trackProgress();

  console.log('\n✓ Deployed. Live at your domain (hard-refresh to clear cache).');
} catch (err) {
  console.error('\n✖ Deploy failed:', err.message);
  process.exitCode = 1;
} finally {
  client.close();
}
