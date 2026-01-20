import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { schema } from "@/integrations/drizzle";
import { env } from "@/utils/env";
import { hashPassword } from "@/utils/password";
import { generateId } from "@/utils/string";

export async function seedDatabase() {
	console.log("⌛ Seeding database...");

	const pool = new Pool({ connectionString: env.DATABASE_URL });
	const db = drizzle({ client: pool, schema });

	try {
		const userId = generateId();

		await db.insert(schema.user).values({
			id: userId,
			name: "Test User",
			email: "test@test.com",
			username: "test",
			displayUsername: "test",
			emailVerified: true,
			image: "https://i.pravatar.cc/300",
		});

		await db.insert(schema.account).values({
			id: generateId(),
			userId,
			accountId: userId,
			password: await hashPassword("password"),
		});
	} catch (error) {
		console.error("🚨 Database seeding failed:", error);
	} finally {
		await pool.end();
	}
}

if (import.meta.main) {
	await seedDatabase();
}
