import dotenv from 'dotenv';
dotenv.config();

// Usar sempre PostgreSQL
const postgres = require('./connection.postgres');

export const db = postgres.db;
export const closeConnection = postgres.closeConnection;

// Exportar schema PostgreSQL
export * from './schema.postgres';
