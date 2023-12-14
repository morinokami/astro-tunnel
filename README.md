# Astro Tunnel

Astro Tunnel is an Astro Integration that exposes your local Astro server to the internet. Internally, it uses Cloudflare’s Quick Tunnels via unjs/untun, so no additional configuration is required to start using it.

## Installation

Run the `astro add` command using the package manager of your choice and you're good to go:

```sh
npx astro add astro-tunnel
```

## Usage

```ts
import { defineConfig } from 'astro/config';

import tunnel from 'astro-tunnel';

export default defineConfig({
  integrations: [tunnel()],
});
```

## Configuration

Astro Tunnel accepts the following options:

```ts
tunnel({
  // The URL to expose. Defaults to http://localhost:4321.
  url: 'http://localhost:4321',
  // The local server port to expose. Defaults to 4321. Only used if `url` is not set.
  port: 3000,
  // The local server hostname to expose. Defaults to localhost. Only used if `url` is not set.
  host: 'localhost',
  // The local server protocol to use. Defaults to http. Only used if `url` is not set.
  protocol: 'http',
  // Whether to verify the local server TLS certificate. Defaults to false.
  verifyTLS: false,
});
```
