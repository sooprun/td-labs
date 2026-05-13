import { execSync } from "child_process"
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

function getAppTitle(): string {
  try {
    const branch =
      process.env.VERCEL_GIT_COMMIT_REF ??
      execSync("git rev-parse --abbrev-ref HEAD", { stdio: "pipe" }).toString().trim()

    if (branch === "master" || branch === "main") return "TrueDraft Firm"

    const name = branch.replace(/^(feature|feat|fix|chore|style)\//, "")
    const featureName = name
      .split(/[-_]/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
    return `TrueDraft Firm — ${featureName}`
  } catch {
    return "TrueDraft Firm"
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "html-title",
      transformIndexHtml(html) {
        return html.replace(/<title>.*?<\/title>/, `<title>${getAppTitle()}</title>`)
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
