import { defineConfig } from "prisma/config";
import { config } from "dotenv";
import { join } from "path";

// Load environment variables in Next.js priority order:
// .env.local > .env
config({ path: join(process.cwd(), ".env") });
config({ path: join(process.cwd(), ".env.local"), override: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
