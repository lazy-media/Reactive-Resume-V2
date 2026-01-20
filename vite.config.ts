import { fileURLToPath } from "node:url";
import { lingui } from "@lingui/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const config = defineConfig({
	define: {
		__APP_VERSION__: JSON.stringify(process.env.npm_package_version),
	},

	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},

	optimizeDeps: {
		exclude: [
			"@tanstack/react-start",
			"@tanstack/react-start/client",
			"@tanstack/react-start/server",
			"@tanstack/start-server-core",
		],
	},

	build: {
		chunkSizeWarningLimit: 10 * 1024, // 10mb

		// Mute MODULE_LEVEL_DIRECTIVE warnings
		rolldownOptions: {
			onLog(level, log, defaultHandler) {
				if (level === "warn" && log.code === "MODULE_LEVEL_DIRECTIVE") return;
				defaultHandler(level, log);
			},
		},
	},

	server: {
		host: true,
		port: 3000,
		strictPort: true,
		allowedHosts: true,
		hmr: {
			host: "localhost",
			port: 3000,
		},
	},

	plugins: [
		lingui(),
		tailwindcss(),
		nitro({ plugins: ["plugins/1.migrate.ts"] }),
		tanstackStart({ router: { semicolons: true, quoteStyle: "double" } }),
		viteReact({ babel: { plugins: [["@lingui/babel-plugin-lingui-macro"]] } }),
		VitePWA({
			outDir: "public",
			registerType: "autoUpdate",
			includeAssets: ["**/*"],
			workbox: {
				globPatterns: ["**/*"],
				clientsClaim: true,
				cleanupOutdatedCaches: true,
				maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10mb
			},
			manifest: {
				name: "Reactive Resume",
				short_name: "Reactive Resume",
				description: "A free and open-source resume builder.",
				id: "/?source=pwa",
				start_url: "/?source=pwa",
				display: "standalone",
				orientation: "portrait",
				theme_color: "#09090B",
				background_color: "#09090B",
				icons: [
					{
						src: "favicon.ico",
						sizes: "48x48",
						type: "image/x-icon",
					},
					{
						src: "pwa-64x64.png",
						sizes: "64x64",
						type: "image/png",
					},
					{
						src: "pwa-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "pwa-512x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "any",
					},
					{
						src: "maskable-icon-512x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "maskable",
					},
				],
				screenshots: [
					{
						src: "screenshots/web/1-landing-page.webp",
						sizes: "any",
						type: "image/webp",
						form_factor: "wide",
						label: "Landing Page",
					},
					{
						src: "screenshots/web/2-resumes-dashboard.webp",
						sizes: "any",
						type: "image/webp",
						form_factor: "wide",
						label: "Resumes Dashboard",
					},
					{
						src: "screenshots/web/3-builder-page.webp",
						sizes: "any",
						type: "image/webp",
						form_factor: "wide",
						label: "Builder Page",
					},
					{
						src: "screenshots/web/4-template-selector.webp",
						sizes: "any",
						type: "image/webp",
						form_factor: "wide",
						label: "Template Selector",
					},
					{
						src: "screenshots/mobile/1-landing-page.webp",
						sizes: "any",
						type: "image/webp",
						form_factor: "narrow",
						label: "Landing Page",
					},
					{
						src: "screenshots/mobile/2-resumes-dashboard.webp",
						sizes: "any",
						type: "image/webp",
						form_factor: "narrow",
						label: "Resumes Dashboard",
					},
					{
						src: "screenshots/mobile/3-builder-page.webp",
						sizes: "any",
						type: "image/webp",
						form_factor: "narrow",
						label: "Builder Page",
					},
					{
						src: "screenshots/mobile/4-template-selector.webp",
						sizes: "any",
						type: "image/webp",
						form_factor: "narrow",
						label: "Template Selector",
					},
				],
				categories: [
					"ai",
					"builder",
					"business",
					"career",
					"cv",
					"editor",
					"free",
					"generator",
					"job-search",
					"multilingual",
					"open-source",
					"privacy",
					"productivity",
					"resume",
					"self-hosted",
					"templates",
					"utilities",
					"writing",
				],
			},
		}),
	],
});

export default config;
