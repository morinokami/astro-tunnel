import { defineConfig } from 'astro/config';

import tunnel from 'astro-tunnel';

// https://astro.build/config
export default defineConfig({
  integrations: [tunnel()],
});
