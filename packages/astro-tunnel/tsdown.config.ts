import { defineConfig } from "tsdown";

export default defineConfig({
	entry: ["src/index.ts", "src/astro-tunnel.ts"],
	format: ["esm"],
	dts: true,
	clean: true,
	minify: true,
});
