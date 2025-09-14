
export const config = {
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL || 'mongodb://localhost:27017/giropro',
  jwtSecret: process.env.JWT_SECRET || 'supersecretjwtkey',
  environment: process.env.NODE_ENV || 'development',
};

