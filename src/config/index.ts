import dotenv from 'dotenv';

dotenv.config();

export const config = {
  restApiUrl: process.env.REST_API_URL || 'http://localhost:4000/api',
  port: parseInt(process.env.PORT || '4001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
};
