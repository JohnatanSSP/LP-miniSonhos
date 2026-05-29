// next.config.ts
import * as fs from "fs";
import * as path from "path";

// Lê o .env manualmente para garantir que as variáveis chegam ao Next.js
// mesmo quando anchor-pki ou dotenvx interceptam o processo
function loadEnvFile(): Record<string, string> {
  const envPath = path.resolve(process.cwd(), ".env");
  const envLocalPath = path.resolve(process.cwd(), ".env.local");

  const vars: Record<string, string> = {};

  for (const filePath of [envPath, envLocalPath]) {
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.substring(0, eqIdx).trim();
      const value = trimmed.substring(eqIdx + 1).trim();
      vars[key] = value;
    }
  }

  return vars;
}

const envVars = loadEnvFile();

// Injeta manualmente no process.env para garantir disponibilidade
for (const [key, value] of Object.entries(envVars)) {
  if (!process.env[key]) {
    process.env[key] = value;
  }
}

// @ts-expect-error - No type definitions available for anchor-pki
import autoCert from "anchor-pki/auto-cert/integrations/next";

const withAutoCert = autoCert({
  enabledEnv: "development",
});

const nextConfig = {
  env: {
    ASAAS_API_KEY: envVars.ASAAS_API_KEY ?? process.env.ASAAS_API_KEY ?? "",
    ASAAS_ENVIRONMENT: envVars.ASAAS_ENVIRONMENT ?? process.env.ASAAS_ENVIRONMENT ?? "sandbox",
  },
};

export default withAutoCert(nextConfig);