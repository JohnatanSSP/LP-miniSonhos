import { defineConfig } from '@prisma/config';
import * as fs from 'fs';
import * as path from 'path';

// Lê o .env manualmente apenas em desenvolvimento local
// No Railway (produção), DATABASE_URL já vem injetada via process.env
function loadEnvLocal() {
  if (process.env.NODE_ENV === 'production') return;

  for (const file of ['.env', '.env.local']) {
    const filePath = path.resolve(process.cwd(), file);
    if (!fs.existsSync(filePath)) continue;
    for (const line of fs.readFileSync(filePath, 'utf-8').split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.substring(0, eq).trim();
      const value = trimmed.substring(eq + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  }
}

loadEnvLocal();

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
