import dotenv from 'dotenv';
dotenv.config();

// Importar conexão PostgreSQL
const postgres = require('./connection.postgres');

export const db = postgres.db;
export const closeConnection = postgres.closeConnection;

// Exportar schema PostgreSQL
export * from './schema.postgres';

// Exportar funções de conexão
export { createDatabaseConnection, checkDatabaseConnection } from './connection.factory';
