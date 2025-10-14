"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
exports.default = {
    schema: './src/db/schema.ts',
    out: './drizzle-sqlite',
    dialect: 'sqlite',
    dbCredentials: {
        url: process.env.SQLITE_DB_PATH || 'giropro.db',
    },
};
