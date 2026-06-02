import * as fs from "fs";
import * as path from "path";
import type { NextConfig } from "next";

function loadEnvFile(): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const file of [".env", ".env.local"]) {
    const p = path.resolve(process.cwd(), file);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, "utf-8").split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const eq = t.indexOf("=");
      if (eq === -1) continue;
      vars[t.substring(0, eq).trim()] = t.substring(eq + 1).trim();
    }
  }
  return vars;
}

const envVars = loadEnvFile();

// Injeta no process.env para Route Handlers
for (const [k, v] of Object.entries(envVars)) {
  if (!process.env[k]) process.env[k] = v;
}

const nextConfig: NextConfig = {

};

export default nextConfig;
