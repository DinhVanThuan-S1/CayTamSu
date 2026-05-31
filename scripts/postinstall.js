const { execSync } = require("child_process");

// Check and fallback DATABASE_URL and DIRECT_URL to prevent Vercel build failure
if (!process.env.DATABASE_URL) {
  console.log("DATABASE_URL not found, using placeholder for generation...");
  process.env.DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/postgres";
}

if (!process.env.DIRECT_URL) {
  console.log("DIRECT_URL not found, falling back to DATABASE_URL...");
  process.env.DIRECT_URL = process.env.DATABASE_URL;
}

try {
  console.log("Running: prisma generate...");
  execSync("npx prisma generate", { stdio: "inherit" });
} catch (error) {
  console.error("Prisma Client generation failed:", error.message);
  process.exit(1);
}
