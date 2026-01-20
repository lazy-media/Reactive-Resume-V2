import z from "zod";
import { create } from "zustand/react";
import {
	awardItemSchema,
	certificationItemSchema,
	customSectionSchema,
	educationItemSchema,
	experienceItemSchema,
	interestItemSchema,
	languageItemSchema,
	profileItemSchema,
	projectItemSchema,
	publicationItemSchema,
	referenceItemSchema,
	skillItemSchema,
	volunteerItemSchema,
} from "@/schema/resume/data";

const dialogTypeSchema = z.discriminatedUnion("type", [
	z.object({ type: z.literal("auth.change-password"), data: z.undefined() }),
	z.object({ type: z.literal("auth.two-factor.enable"), data: z.undefined() }),
	z.object({ type: z.literal("auth.two-factor.disable"), data: z.undefined() }),
	z.object({ type: z.literal("api-key.create"), data: z.undefined() }),
	z.object({ type: z.literal("resume.create"), data: z.undefined() }),
	z.object({
		type: z.literal("resume.update"),
		data: z.object({ id: z.string(), name: z.string(), slug: z.string(), tags: z.array(z.string()) }),
	}),
	z.object({ type: z.literal("resume.import"), data: z.undefined() }),
	z.object({
		type: z.literal("resume.duplicate"),
		data: z.object({
			id: z.string(),
			name: z.string(),
			slug: z.string(),
			tags: z.array(z.string()),
			shouldRedirect: z.boolean().optional(),
		}),
	}),
	z.object({ type: z.literal("resume.template.gallery"), data: z.undefined() }),
	z.object({ type: z.literal("resume.sections.profiles.create"), data: profileItemSchema.optional() }),
	z.object({ type: z.literal("resume.sections.profiles.update"), data: profileItemSchema }),
	z.object({ type: z.literal("resume.sections.experience.create"), data: experienceItemSchema.optional() }),
	z.object({ type: z.literal("resume.sections.experience.update"), data: experienceItemSchema }),
	z.object({ type: z.literal("resume.sections.education.create"), data: educationItemSchema.optional() }),
	z.object({ type: z.literal("resume.sections.education.update"), data: educationItemSchema }),
	z.object({ type: z.literal("resume.sections.projects.create"), data: projectItemSchema.optional() }),
	z.object({ type: z.literal("resume.sections.projects.update"), data: projectItemSchema }),
	z.object({ type: z.literal("resume.sections.skills.create"), data: skillItemSchema.optional() }),
	z.object({ type: z.literal("resume.sections.skills.update"), data: skillItemSchema }),
	z.object({ type: z.literal("resume.sections.languages.create"), data: languageItemSchema.optional() }),
	z.object({ type: z.literal("resume.sections.languages.update"), data: languageItemSchema }),
	z.object({ type: z.literal("resume.sections.awards.create"), data: awardItemSchema.optional() }),
	z.object({ type: z.literal("resume.sections.awards.update"), data: awardItemSchema }),
	z.object({ type: z.literal("resume.sections.certifications.create"), data: certificationItemSchema.optional() }),
	z.object({ type: z.literal("resume.sections.certifications.update"), data: certificationItemSchema }),
	z.object({ type: z.literal("resume.sections.publications.create"), data: publicationItemSchema.optional() }),
	z.object({ type: z.literal("resume.sections.publications.update"), data: publicationItemSchema }),
	z.object({ type: z.literal("resume.sections.interests.create"), data: interestItemSchema.optional() }),
	z.object({ type: z.literal("resume.sections.interests.update"), data: interestItemSchema }),
	z.object({ type: z.literal("resume.sections.volunteer.create"), data: volunteerItemSchema.optional() }),
	z.object({ type: z.literal("resume.sections.volunteer.update"), data: volunteerItemSchema }),
	z.object({ type: z.literal("resume.sections.references.create"), data: referenceItemSchema.optional() }),
	z.object({ type: z.literal("resume.sections.references.update"), data: referenceItemSchema }),
	z.object({ type: z.literal("resume.sections.custom.create"), data: customSectionSchema.optional() }),
	z.object({ type: z.literal("resume.sections.custom.update"), data: customSectionSchema }),
]);

type DialogSchema = z.infer<typeof dialogTypeSchema>;
type DialogType = DialogSchema["type"];

type DialogData<T extends DialogType> = Extract<DialogSchema, { type: T }>["data"];

// biome-ignore lint/complexity/noBannedTypes: {} is the appropriate type for this case
type DialogPropsData<T extends DialogType> = DialogData<T> extends undefined ? {} : { data: DialogData<T> };

export type DialogProps<T extends DialogType> = DialogPropsData<T>;

interface DialogStoreState {
	open: boolean;
	activeDialog: DialogSchema | null;
}

interface DialogStoreActions {
	onOpenChange: (open: boolean) => void;
	openDialog: <T extends DialogType>(type: T, data: DialogData<T>) => void;
	closeDialog: () => void;
}

type DialogStore = DialogStoreState & DialogStoreActions;

export const useDialogStore = create<DialogStore>((set) => ({
	open: false,
	activeDialog: null,
	onOpenChange: (open) => {
		set({ open });

		if (!open) {
			setTimeout(() => {
				set({ activeDialog: null });
			}, 300);
		}
	},
	openDialog: (type, data) =>
		set({
			open: true,
			activeDialog: { type, data } as DialogSchema,
		}),
	closeDialog: () => {
		set({ open: false });
		setTimeout(() => {
			set({ activeDialog: null });
		}, 300);
	},
}));
