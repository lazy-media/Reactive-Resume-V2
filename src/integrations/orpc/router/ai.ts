import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createGateway, generateText, Output, streamText } from "ai";
import { createOllama } from "ai-sdk-ollama";
import { match } from "ts-pattern";
import z, { flattenError, ZodError } from "zod";
import docxParserSystemPrompt from "@/integrations/ai/prompts/docx-parser-system.md?raw";
import docxParserUserPrompt from "@/integrations/ai/prompts/docx-parser-user.md?raw";
import pdfParserSystemPrompt from "@/integrations/ai/prompts/pdf-parser-system.md?raw";
import pdfParserUserPrompt from "@/integrations/ai/prompts/pdf-parser-user.md?raw";
import { defaultResumeData, resumeDataSchema } from "@/schema/resume/data";
import { protectedProcedure } from "../context";

const aiProviderSchema = z.enum(["vercel-ai-gateway", "openai", "anthropic", "gemini", "ollama"]);

type AIProvider = z.infer<typeof aiProviderSchema>;

type GetModelInput = {
	provider: AIProvider;
	model: string;
	apiKey: string;
	baseURL?: string;
};

function getModel(input: GetModelInput) {
	const { provider, model, apiKey, baseURL } = input;

	return match(provider)
		.with("vercel-ai-gateway", () => createGateway({ apiKey }).languageModel(model))
		.with("openai", () => createOpenAI({ apiKey }).languageModel(model))
		.with("anthropic", () => createAnthropic({ apiKey }).languageModel(model))
		.with("gemini", () => createGoogleGenerativeAI({ apiKey }).languageModel(model))
		.with("ollama", () => createOllama({ apiKey, baseURL }).languageModel(model))
		.exhaustive();
}

const aiCredentialsSchema = z.object({
	provider: aiProviderSchema,
	model: z.string(),
	apiKey: z.string(),
	baseURL: z.string().optional(),
});

const fileInputSchema = z.object({
	name: z.string(),
	data: z.string(), // base64 encoded
});

export const aiRouter = {
	testConnection: protectedProcedure
		.input(
			z.object({
				provider: aiProviderSchema,
				model: z.string(),
				apiKey: z.string(),
				baseURL: z.string().optional(),
			}),
		)
		.handler(async function* ({ input }) {
			const stream = streamText({
				temperature: 0,
				model: getModel(input),
				messages: [{ role: "user", content: 'Respond with "1"' }],
			});

			yield* stream.textStream;
		}),

	parsePdf: protectedProcedure
		.input(
			z.object({
				...aiCredentialsSchema.shape,
				file: fileInputSchema,
			}),
		)
		.handler(async ({ input }) => {
			try {
				const model = getModel(input);

				const result = await generateText({
					model,
					maxRetries: 0,
					output: Output.object({
						schema: resumeDataSchema.omit({ picture: true, metadata: true, customSections: true }),
					}),
					messages: [
						{
							role: "system",
							content: pdfParserSystemPrompt,
						},
						{
							role: "user",
							content: [
								{ type: "text", text: pdfParserUserPrompt },
								{
									type: "file",
									filename: input.file.name,
									mediaType: "application/pdf",
									data: input.file.data,
								},
							],
						},
					],
				});

				return resumeDataSchema.parse({
					...result.output,
					customSections: [],
					picture: defaultResumeData.picture,
					metadata: defaultResumeData.metadata,
				});
			} catch (error) {
				if (error instanceof ZodError) {
					const errors = flattenError(error);
					throw new Error(JSON.stringify(errors));
				}

				throw error;
			}
		}),

	parseDocx: protectedProcedure
		.input(
			z.object({
				...aiCredentialsSchema.shape,
				file: fileInputSchema,
				mediaType: z.enum([
					"application/msword",
					"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
				]),
			}),
		)
		.handler(async ({ input }) => {
			try {
				const model = getModel(input);

				const result = await generateText({
					model,
					maxRetries: 0,
					output: Output.object({
						schema: resumeDataSchema.omit({ picture: true, metadata: true, customSections: true }),
					}),
					messages: [
						{ role: "system", content: docxParserSystemPrompt },
						{
							role: "user",
							content: [
								{ type: "text", text: docxParserUserPrompt },
								{
									type: "file",
									filename: input.file.name,
									mediaType: input.mediaType,
									data: input.file.data,
								},
							],
						},
					],
				});

				return resumeDataSchema.parse({
					...result.output,
					customSections: [],
					picture: defaultResumeData.picture,
					metadata: defaultResumeData.metadata,
				});
			} catch (error) {
				if (error instanceof ZodError) {
					const errors = flattenError(error);
					throw new Error(JSON.stringify(errors));
				}

				throw error;
			}
		}),
};
