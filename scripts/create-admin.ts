import { db } from "../src/lib/db";
import { users } from "../src/lib/db/schema";
import { AuthService } from "../src/lib/auth/auth.service";
import "dotenv/config";
import { eq } from "drizzle-orm";

async function main() {
    const email = "admin@abhholdings.com";
    const password = "admin123";

    console.log(`🚀 Checking for admin user: ${email}...`);

    try {
        const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);

        if (existing) {
            console.log("✅ Admin user already exists.");
        } else {
            const passwordHash = await AuthService.hashPassword(password);
            await db.insert(users).values({
                email,
                passwordHash,
            });
            console.log(`✅ Admin user created: ${email} / ${password}`);
        }
        process.exit(0);
    } catch (e) {
        console.error("❌ Failed to create admin:", e);
        process.exit(1);
    }
}

main();
