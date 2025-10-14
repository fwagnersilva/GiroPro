"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
if (!process.env.DATABASE_URL) {
    throw new Error('❌ DATABASE_URL não está definida no arquivo .env');
}
var config = {
    schema: "./src/db/schema.postgres.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL,
    },
    verbose: true,
    strict: true,
};
exports.default = config;
