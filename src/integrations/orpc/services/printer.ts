import { ORPCError } from "@orpc/server";
import { printMarginTemplates } from "@/schema/templates";
import { env } from "@/utils/env";
import { generatePrinterToken } from "@/utils/printer-token";
import { resumeService } from "./resume";
import { getStorageService, uploadFile } from "./storage";

const pageDimensions = {
	a4: {
		width: "210mm",
		height: "297mm",
	},
	letter: {
		width: "8.5in",
		height: "11in",
	},
} as const;

const SCREENSHOT_TTL = 1000 * 60 * 60; // 1 hour

export const printerService = {
	printResumeAsPDF: async (input: { id: string; userId: string }): Promise<string> => {
		const storageService = getStorageService();

		// Delete any existing PDFs for this resume
		const pdfPrefix = `uploads/${input.userId}/pdfs/${input.id}`;
		await storageService.delete(pdfPrefix);

		const resume = await resumeService.getByIdForPrinter({ id: input.id });
		const format = resume.data.metadata.page.format;
		const locale = resume.data.metadata.page.locale;

		const baseUrl = env.PRINTER_APP_URL ?? env.APP_URL;
		const domain = new URL(baseUrl).hostname;

		const token = generatePrinterToken(input.id);
		const url = `${baseUrl}/printer/${input.id}?token=${token}`;

		const formData = new FormData();
		const cookies = [{ name: "locale", value: locale, domain }];

		const isPrintMargin = printMarginTemplates.includes(resume.data.metadata.template);
		const marginX = isPrintMargin ? `${resume.data.metadata.page.marginX.toString()}pt` : "0";
		const marginY = isPrintMargin ? `${resume.data.metadata.page.marginY.toString()}pt` : "0";

		formData.append("url", url);
		formData.append("marginTop", marginY);
		formData.append("marginLeft", marginX);
		formData.append("marginRight", marginX);
		formData.append("marginBottom", marginY);
		formData.append("printBackground", "true");
		formData.append("skipNetworkIdleEvent", "false");
		formData.append("cookies", JSON.stringify(cookies));
		formData.append("paperWidth", pageDimensions[format].width);
		formData.append("paperHeight", pageDimensions[format].height);

		const headers = new Headers();

		if (env.GOTENBERG_USERNAME && env.GOTENBERG_PASSWORD) {
			const credentials = `${env.GOTENBERG_USERNAME}:${env.GOTENBERG_PASSWORD}`;
			const encodedCredentials = btoa(credentials);
			headers.set("Authorization", `Basic ${encodedCredentials}`);
		}

		const response = await fetch(`${env.GOTENBERG_ENDPOINT}/forms/chromium/convert/url`, {
			headers,
			method: "POST",
			body: formData,
		});

		if (!response.ok) {
			throw new ORPCError("UNAUTHORIZED", {
				status: response.status,
				message: response.statusText,
			});
		}

		const pdfBuffer = await response.arrayBuffer();

		// Store PDF and return URL
		const result = await uploadFile({
			userId: input.userId,
			resumeId: input.id,
			data: new Uint8Array(pdfBuffer),
			contentType: "application/pdf",
			type: "pdf",
		});

		return result.url;
	},

	getResumeScreenshot: async (input: { id: string; userId: string }): Promise<string> => {
		const storageService = getStorageService();
		const screenshotPrefix = `uploads/${input.userId}/screenshots/${input.id}`;

		const existingScreenshots = await storageService.list(screenshotPrefix);
		const now = Date.now();

		if (existingScreenshots.length > 0) {
			const sortedFiles = existingScreenshots
				.map((path) => {
					const filename = path.split("/").pop();
					const match = filename?.match(/^(\d+)\.webp$/);
					return match ? { path, timestamp: Number(match[1]) } : null;
				})
				.filter((item): item is { path: string; timestamp: number } => item !== null)
				.sort((a, b) => b.timestamp - a.timestamp);

			if (sortedFiles.length > 0) {
				const latest = sortedFiles[0];
				const age = now - latest.timestamp;

				if (age < SCREENSHOT_TTL) {
					// Return URL of cached screenshot
					return new URL(latest.path, env.APP_URL).toString();
				}

				// Delete old screenshots
				await Promise.all(sortedFiles.map((file) => storageService.delete(file.path)));
			}
		}

		const baseUrl = env.PRINTER_APP_URL ?? env.APP_URL;

		const token = generatePrinterToken(input.id);
		const url = `${baseUrl}/printer/${input.id}?token=${token}`;

		const formData = new FormData();

		formData.append("url", url);
		formData.append("clip", "true");
		formData.append("width", "794");
		formData.append("height", "1123");
		formData.append("format", "webp");
		formData.append("optimizeForSpeed", "true");
		formData.append("skipNetworkIdleEvent", "false");

		const headers = new Headers();

		if (env.GOTENBERG_USERNAME && env.GOTENBERG_PASSWORD) {
			const credentials = `${env.GOTENBERG_USERNAME}:${env.GOTENBERG_PASSWORD}`;
			const encodedCredentials = btoa(credentials);
			headers.set("Authorization", `Basic ${encodedCredentials}`);
		}

		const response = await fetch(`${env.GOTENBERG_ENDPOINT}/forms/chromium/screenshot/url`, {
			headers,
			method: "POST",
			body: formData,
		});

		if (!response.ok) {
			throw new ORPCError("UNAUTHORIZED", {
				status: response.status,
				message: response.statusText,
			});
		}

		const imageBuffer = await response.arrayBuffer();

		// Store screenshot and return URL
		const result = await uploadFile({
			userId: input.userId,
			resumeId: input.id,
			data: new Uint8Array(imageBuffer),
			contentType: "image/webp",
			type: "screenshot",
		});

		return result.url;
	},
};
