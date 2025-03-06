import logger from 'infra/logger';

import { env } from '@infra/env';

export const healthCheck = (): string => {
  logger.info(`Health check for evironment: ${env.NODE_ENV}`);
  return 'OK';
};
