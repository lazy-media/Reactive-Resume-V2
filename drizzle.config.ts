import { defineConfig } from "drizzle-kit";
import invariant from "tiny-invariant";

invariant(process.env.DATABASE_URL, "DATABASE_URL is not set");

export default defineConfig({
	out: "./migrations",
	dialect: "postgresql",
	schema: "./src/integrations/drizzle/schema.ts",
	dbCredentials: {
		url: process.env.DATABASE_URL,
	},
});
