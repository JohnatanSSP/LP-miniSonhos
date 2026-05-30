import * as fs from "fs";
import * as path from "path";

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
for (const [k, v] of Object.entries(envVars)) {
  if (!process.env[k]) process.env[k] = v;
}

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    ASAAS_API_KEY: envVars.ASAAS_API_KEY ?? process.env.ASAAS_API_KEY ?? "",
    ASAAS_ENVIRONMENT: envVars.ASAAS_ENVIRONMENT ?? process.env.ASAAS_ENVIRONMENT ?? "sandbox",
    ADMIN_SECRET: envVars.ADMIN_SECRET ?? process.env.ADMIN_SECRET ?? "",
  },
};

export default nextConfig;
