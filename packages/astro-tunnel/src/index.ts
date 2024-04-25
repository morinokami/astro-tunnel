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
		acceptCloudflareNotice: false,
	},
): AstroIntegration {
	return {
		name: "astro-tunnel",
		hooks: {
			"astro:config:setup": ({ addDevToolbarApp }) => {
				const __filename = fileURLToPath(import.meta.url);
				const __dirname = dirname(__filename);
				addDevToolbarApp({
					id: "astro-tunnel",
					name: "Astro Tunnel",
					icon: '<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#6366F1"/><stop offset="50%" style="stop-color:#8B5CF6"/><stop offset="100%" style="stop-color:#EC4899"/></linearGradient></defs><path d="M0.877075 7.49991C0.877075 3.84222 3.84222 0.877075 7.49991 0.877075C11.1576 0.877075 14.1227 3.84222 14.1227 7.49991C14.1227 11.1576 11.1576 14.1227 7.49991 14.1227C3.84222 14.1227 0.877075 11.1576 0.877075 7.49991ZM7.49991 1.82708C4.36689 1.82708 1.82708 4.36689 1.82708 7.49991C1.82708 10.6329 4.36689 13.1727 7.49991 13.1727C10.6329 13.1727 13.1727 10.6329 13.1727 7.49991C13.1727 4.36689 10.6329 1.82708 7.49991 1.82708Z" fill="url(#gradient)"></path></svg>',
					entrypoint: join(__dirname, "./astro-tunnel.js"),
				});
			},
			"astro:server:setup": ({ server }) => {
				let tunnel: Tunnel | undefined;

				server.hot.on(
					"astro-dev-toolbar:astro-tunnel:initialized",
					async () => {
						// Send the tunnel URL to the client when the app is initialized
						server.hot.send("astro-tunnel:tunnel-url", {
							url: await tunnel?.getURL(),
						});
					},
				);

				server.hot.on("astro-dev-toolbar:astro-tunnel:toggled", async () => {
					// Send the tunnel URL to the client when the user clicks on the app icon
					server.hot.send("astro-tunnel:tunnel-url", {
						url: await tunnel?.getURL(),
					});
				});

				server.hot.on(
					"astro-tunnel:toggled",
					async (data: { checked: boolean }) => {
						// Toggle the tunnel when the user toggles the switch
						if (data.checked) {
							tunnel = await startTunnel(options);
							server.hot.send("astro-tunnel:tunnel-url", {
								url: await tunnel?.getURL(),
							});
						} else {
							await tunnel?.close();
							server.hot.send("astro-tunnel:tunnel-url", {
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
