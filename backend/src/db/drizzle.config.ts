import dotenv from 'dotenv';
dotenv.config();

export default {
  schema: "./src/db/schema.postgres.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgresql://giropro:giropro123@localhost:5432/giropro_dev",
  },
};
