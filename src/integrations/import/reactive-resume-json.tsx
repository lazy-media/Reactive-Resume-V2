import { flattenError, ZodError } from "zod";
import { type ResumeData, resumeDataSchema } from "@/schema/resume/data";

export class ReactiveResumeJSONImporter {
	parse(json: string): ResumeData {
		try {
			return resumeDataSchema.parse(JSON.parse(json));
		} catch (error) {
			if (error instanceof ZodError) {
				const errors = flattenError(error);
				throw new Error(JSON.stringify(errors));
			}

			throw error;
		}
	}
}
