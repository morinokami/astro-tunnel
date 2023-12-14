# Astro Tunnel

<img width="1076" alt="Screenshot 2023-12-14 at 23 02 30" src="https://github.com/morinokami/astro-tunnel/assets/7889778/59ae61a3-f78a-4292-a143-bcf7f78c2e06">

Astro Tunnel is an [Astro Dev Toolbar App](https://docs.astro.build/en/reference/dev-toolbar-app-reference/) that exposes your local Astro server to the internet. Internally, it uses Cloudflare's [Quick Tunnels](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/do-more-with-tunnels/trycloudflare/) via [unjs/untun](https://github.com/unjs/untun), so no additional configuration is required to start using it.

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

When starting a tunnel for the first time, you will be asked to accept the terms of the Cloudflare License, Terms and Privacy Policy on the command line. After accepting them, a tunnel will be started and a public URL for your local Astro server will be displayed inside the Dev Toolbar.

If you have any issues with starting a tunnel, try separately installing `cloudflared` by running `npx untun@latest tunnel http://localhost:3000` first. After that, you should be able to start a tunnel from within the App.

## Configuration

Astro Tunnel accepts the following options:

```ts
tunnel({
  // The URL to expose. Defaults to http://localhost:4321.
  url: 'http://localhost:4321',
  // The local server port to expose. Defaults to 4321. Only used if `url` is not set.
  port: 4321,
  // The local server hostname to expose. Defaults to localhost. Only used if `url` is not set.
  host: 'localhost',
  // The local server protocol to use. Defaults to http. Only used if `url` is not set.
  protocol: 'http',
  // Whether to verify the local server TLS certificate. Defaults to false.
  verifyTLS: false,
});
```
