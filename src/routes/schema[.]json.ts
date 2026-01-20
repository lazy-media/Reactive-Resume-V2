import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";
import z from "zod";
import { resumeDataSchema } from "@/schema/resume/data";

function handler({ request }: { request: Request }) {
	const url = new URL(request.url);

	const resumeDataJSONSchema = z.toJSONSchema(
		resumeDataSchema.extend({
			version: z.literal("5.0.0").describe("The version of the Reactive Resume JSON Schema"),
			$schema: z
				.literal(`${url.origin}/schema.json`)
				.describe("The URL of the Reactive Resume JSON Schema, used for validation and documentation purposes."),
		}),
	);

	return json(resumeDataJSONSchema, {
		status: 200,
		headers: {
			"Content-Type": "application/schema+json; charset=utf-8",
			"Cache-Control": "public, max-age=86400, immutable",
			"Surrogate-Control": "max-age=86400",
			"X-Content-Type-Options": "nosniff",
			"X-Robots-Tag": "index, follow",
			ETag: `"v5.0.0"`,
			Vary: "Accept",
		},
	});
}

export const Route = createFileRoute("/schema.json")({
	server: {
		handlers: {
			GET: handler,
		},
	},
});
