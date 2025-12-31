import { registerAs } from '@nestjs/config';

export default registerAs(
  'app',
  (): Record<string, unknown> => ({
    name: process.env.APP_NAME || 'NestJS App',
    env: process.env.APP_ENV || 'development',
    port: parseInt(process.env.APP_PORT || '3000', 10),
  }),
);
