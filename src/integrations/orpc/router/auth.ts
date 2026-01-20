import z from "zod";
import { protectedProcedure, publicProcedure } from "../context";
import { authService, type ProviderList } from "../services/auth";

export const authRouter = {
	providers: {
		list: publicProcedure
			.route({
				method: "GET",
				path: "/auth/providers/list",
				tags: ["Authentication"],
				summary: "List all auth providers",
				description:
					"A list of all authentication providers, and their display names, supported by the instance of Reactive Resume.",
			})
			.handler((): ProviderList => {
				return authService.providers.list();
			}),
	},

	verifyResumePassword: publicProcedure
		.route({
			method: "POST",
			path: "/auth/verify-resume-password",
			tags: ["Authentication", "Resume"],
			summary: "Verify resume password",
			description: "Verify a resume password, to grant access to the locked resume.",
		})
		.input(
			z.object({
				slug: z.string().min(1),
				username: z.string().min(1),
				password: z.string().min(1),
			}),
		)
		.output(z.boolean())
		.handler(async ({ input }): Promise<boolean> => {
			return await authService.verifyResumePassword({
				slug: input.slug,
				username: input.username,
				password: input.password,
			});
		}),

	deleteAccount: protectedProcedure
		.route({
			method: "DELETE",
			path: "/auth/delete-account",
			tags: ["Authentication"],
			summary: "Delete user account",
			description: "Delete the authenticated user's account and all associated data.",
		})
		.handler(async ({ context }): Promise<void> => {
			return await authService.deleteAccount({ userId: context.user.id });
		}),
};
