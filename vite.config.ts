import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';

// We mock manifest loading since manifest.json comes in Task 2
// For now, keep it simple
const manifest = {
  manifest_version: 3,
  name: "BOSS Agent",
  version: "1.0.0"
} as any;

export default defineConfig({
  plugins: [react(), crx({ manifest })],
});