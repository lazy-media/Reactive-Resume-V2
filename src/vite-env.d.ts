/// <reference types="vite-plugin-pwa/client" />

import type { AriaAttributes, DOMAttributes } from "react";

declare const __APP_VERSION__: string;

declare module "*.css";
declare module "@fontsource/*" {}
declare module "@fontsource-variable/*" {}

declare module "react" {
	interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
		fetchpriority?: "high" | "low" | "auto";
	}
}

declare namespace NodeJS {
	interface ProcessEnv {
		// Basics
		PORT: string;
		APP_URL: string;
		PRINTER_APP_URL?: string;

		// Printer
		GOTENBERG_ENDPOINT: string;
		GOTENBERG_USERNAME?: string;
		GOTENBERG_PASSWORD?: string;

		// Authentication
		AUTH_SECRET: string;

		// Database
		DATABASE_URL: string;

		// Social Auth (Google)
		GOOGLE_CLIENT_ID?: string;
		GOOGLE_CLIENT_SECRET?: string;

		// Social Auth (GitHub)
		GITHUB_CLIENT_ID?: string;
		GITHUB_CLIENT_SECRET?: string;

		// Storage (Optional)
		S3_ACCESS_KEY_ID?: string;
		S3_SECRET_ACCESS_KEY?: string;
		S3_REGION?: string;
		S3_ENDPOINT?: string;
		S3_BUCKET?: string;
		S3_FORCE_PATH_STYLE?: string | boolean;

		// Custom OAuth Provider
		OAUTH_PROVIDER_NAME?: string;
		OAUTH_CLIENT_ID?: string;
		OAUTH_CLIENT_SECRET?: string;
		OAUTH_DISCOVERY_URL?: string;
		OAUTH_AUTHORIZATION_URL?: string;

		// Feature Flags
		FLAG_DEBUG_PRINTER: string | boolean;
		FLAG_DISABLE_SIGNUP: string | boolean;
	}
}
