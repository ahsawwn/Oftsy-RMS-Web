import "dotenv/config";
import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing from environment variables");
}

export default defineConfig({
    schema: "./src/lib/db/schema.ts", // Path to your schema file
    out: "./drizzle",                // Where migrations will be stored
    dialect: "postgresql",           // Target database engine
    dbCredentials: {
        url: process.env.DATABASE_URL,
    },
    verbose: true,
    strict: true,
});