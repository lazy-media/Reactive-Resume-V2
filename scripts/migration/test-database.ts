import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "@/utils/env";

const pool = new Pool({ connectionString: env.DATABASE_URL });
const db = drizzle({ client: pool });

try {
	const result = await db.execute(sql`SELECT 1 as connected`);
	console.log("✅ Database connection successful", JSON.stringify(result));
} catch (error) {
	console.error("🚨 Database connection failed:", error);
	process.exit(1);
} finally {
	await pool.end();
	process.exit(0);
}
