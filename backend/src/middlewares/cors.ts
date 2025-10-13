import cors from 'cors';

export const corsConfig = cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://giropro-frontend-u3dw.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});
