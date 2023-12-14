import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { AstroIntegration } from "astro";
import { startTunnel } from "untun";
import type { Tunnel, TunnelOptions } from "untun";

type AstroTunnelOptions = TunnelOptions;

export default function createAstroTunnelIntegration(
	options: AstroTunnelOptions = {
		port: 4321,
		hostname: "localhost",
		protocol: "http",
		verifyTLS: false,
	},
): AstroIntegration {
	return {
		name: "astro-tunnel",
		hooks: {
			"astro:config:setup": ({ addDevToolbarApp }) => {
				const __filename = fileURLToPath(import.meta.url);
				const __dirname = dirname(__filename);
				addDevToolbarApp(join(__dirname, "./astro-tunnel.js"));
			},
			"astro:server:setup": ({ server }) => {
				let tunnel: Tunnel | undefined;

				server.ws.on("astro-dev-toolbar:astro-tunnel:initialized", async () => {
					// Send the tunnel URL to the client when the app is initialized
					server.ws.send("astro-tunnel:tunnel-url", {
						url: await tunnel?.getURL(),
					});
				});

				server.ws.on("astro-dev-toolbar:astro-tunnel:toggled", async () => {
					// Send the tunnel URL to the client when the user clicks on the app icon
					server.ws.send("astro-tunnel:tunnel-url", {
						url: await tunnel?.getURL(),
					});
				});

				server.ws.on(
					"astro-tunnel:toggled",
					async (data: { checked: boolean }) => {
						// Toggle the tunnel when the user toggles the switch
						if (data.checked) {
							tunnel = await startTunnel(options);
							server.ws.send("astro-tunnel:tunnel-url", {
								url: await tunnel?.getURL(),
							});
						} else {
							await tunnel?.close();
							server.ws.send("astro-tunnel:tunnel-url", {
								url: undefined,
							});
							tunnel = undefined;
						}
					},
				);
			},
		},
	};
}
