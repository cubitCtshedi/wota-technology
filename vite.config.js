import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `vite preview` falls straight back to the SPA shell for /contact, which hides
// the whole point of the prerender step — you'd never see the per-route <head>
// locally. Apache resolves /contact to /contact/index.html (see public/.htaccess);
// this makes the preview server do the same, so what you check locally is what
// crawlers get in production.
function cleanUrlPreview() {
  return {
    name: 'wota-clean-url-preview',
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        const [path] = (req.url || '/').split('?');
        if (path !== '/' && !path.includes('.')) {
          const candidate = join(server.config.build.outDir, path, 'index.html');
          if (existsSync(candidate)) req.url = `${path.replace(/\/$/, '')}/index.html`;
        }
        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), cleanUrlPreview()],
});
