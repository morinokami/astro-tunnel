import { defineConfig } from "tsup";

export default defineConfig({
	dts: true,
	entry: ["src/index.ts", "src/astro-tunnel.ts"],
	format: ["esm"],
	sourcemap: true,
	target: "esnext",
});
