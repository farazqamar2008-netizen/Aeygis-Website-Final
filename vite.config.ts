import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { OFFERINGS } from "./src/data/site";

// The site is one React app, but every offering page also gets a real HTML file in the build
// (<slug>/index.html and <slug>.html), so it loads on any static host without a rewrite rule.
// 404.html covers hosts that serve it for unknown paths; the app then renders the home page.
function staticRoutes(): Plugin {
  return {
    name: "aeygis-static-routes",
    apply: "build",
    writeBundle(options) {
      const out = options.dir!;
      const html = readFileSync(join(out, "index.html"), "utf8");
      const write = (file: string, source: string) => {
        mkdirSync(dirname(join(out, file)), { recursive: true });
        writeFileSync(join(out, file), source);
      };
      for (const o of OFFERINGS) {
        const page = html
          .replace(/<title>[^<]*<\/title>/, `<title>${o.name} | Aeygis</title>`)
          .replace(/(<meta name="description" content=")[^"]*/, `$1${o.name}: ${o.tagline}.`);
        write(`${o.slug}/index.html`, page);
        write(`${o.slug}.html`, page);
      }
      write("404.html", html);
    },
  };
}

export default defineConfig({
  plugins: [react(), staticRoutes()],
});
