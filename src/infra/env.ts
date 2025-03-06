import 'dotenv/config';
import { z } from 'zod';

import AppError from '@shared/errors/AppError';

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'prod']),
  APP_PORT: z.coerce.number(),
});

const parsedSchema = envSchema.safeParse(process.env);
if (parsedSchema.success === false) {
  const message = `Missing or Invalid environment variables: \n' ${JSON.stringify(parsedSchema.error.format())} `;
  throw new AppError(500, 'ENV_VARIABLES', message, 'EnvConfig');
}

export const env = parsedSchema.data;
