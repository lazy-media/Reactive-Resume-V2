import z from "zod";
import type { auth } from "./config";

export type AuthSession = typeof auth.$Infer.Session;

const authProviderSchema = z.enum(["credential", "google", "github", "custom"]);

export type AuthProvider = z.infer<typeof authProviderSchema>;
