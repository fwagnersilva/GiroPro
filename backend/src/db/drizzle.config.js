"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
exports.default = {
    schema: "./src/db/schema.postgres.ts",
    out: "./drizzle",
    dbCredentials: {
        url: process.env.DATABASE_URL || "postgresql://giropro:giropro123@localhost:5432/giropro_dev",
    },
};
