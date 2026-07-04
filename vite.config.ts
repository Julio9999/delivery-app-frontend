import path from "path";
import { execSync } from "node:child_process";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import pkg from "./package.json" with { type: "json" };

function getGitShortSha(): string {
  // Prefer the SHA injected by CI/CD via the GIT_SHA env var (Docker build-arg).
  // Fall back to the local git repo (works in dev mode where .git is present).
  // Last resort: literal "unknown".
  const fromEnv = process.env.GIT_SHA?.trim();
  if (fromEnv) return fromEnv;

  try {
    return execSync("git rev-parse --short HEAD", {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    return "unknown";
  }
}

// https://vite.dev/config/
export default defineConfig(() => {
  const shortSha = getGitShortSha();
  const builtAt = new Date().toISOString();
  const appVersion = `v${pkg.version} (${shortSha}) - ${builtAt}`;

  return {
    plugins: [
      react({
        babel: {
          plugins: [["babel-plugin-react-compiler"]],
        },
      }),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      __APP_VERSION__: JSON.stringify(appVersion),
    },
  };
});
