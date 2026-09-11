import node from "@astrojs/node";
import react from "@astrojs/react";
import auditLog from "@emdash-cms/plugin-audit-log";
import { defineConfig, fontProviders } from "astro/config";
import emdash, { local } from "emdash/astro";
import { sqlite } from "emdash/db";
import { embedsPlugin } from "./src/plugins/embeds/index.ts";

export default defineConfig({
	site: process.env.ORIGIN || "http://localhost:4321",
	output: "server",
	adapter: node({
		mode: "standalone",
		trustProxy: true,
	}),
	image: {
		layout: "constrained",
		responsiveStyles: true,
	},
	integrations: [
		react(),
		emdash({
			database: sqlite({ url: process.env.DATABASE_URL || "file:./data.db" }),
			storage: local({
				directory: process.env.UPLOADS_DIR || "./uploads",
				baseUrl: "/_emdash/api/media/file",
			}),
			plugins: [auditLog, embedsPlugin()],
		}),
	],
	fonts: [
		{
			provider: fontProviders.google(),
			name: "Inter",
			cssVariable: "--font-sans",
			weights: [400, 500, 600, 700],
			fallbacks: ["sans-serif"],
		},
		{
			provider: fontProviders.google(),
			name: "JetBrains Mono",
			cssVariable: "--font-mono",
			weights: [400, 500],
			fallbacks: ["monospace"],
		},
		{
			provider: fontProviders.google(),
			name: "Source Serif 4",
			cssVariable: "--font-serif",
			weights: [600, 700],
			fallbacks: ["Georgia", "Times New Roman", "serif"],
		},
	],
	devToolbar: { enabled: false },
});
