import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    server: {
      port: 5173,
      host: true,
    },
    define: {
      "process.env.ANTHROPIC_API_KEY": JSON.stringify(env.ANTHROPIC_API_KEY || ""),
      "process.env.ANTHROPIC_BASE_URL": JSON.stringify(env.ANTHROPIC_BASE_URL || ""),
    },
  };
});
