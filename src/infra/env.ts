import 'dotenv/config';
import { number, z } from 'zod';

import AppError from '@shared/errors/AppError';

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'prod']),
  APP_PORT: z.coerce.number(),
  BCRYPT_SALT: z.coerce.number().default(12),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.coerce.number().default(3600),
  JWT_ALGORITHM: z.string().default('HS256'),
});

const parsedSchema = envSchema.safeParse(process.env);
if (parsedSchema.success === false) {
  const message = `Missing or Invalid environment variables: \n' ${JSON.stringify(parsedSchema.error.format())} `;
  throw new AppError(500, 'ENV_VARIABLES', message, 'EnvConfig');
}

export const env = parsedSchema.data;
