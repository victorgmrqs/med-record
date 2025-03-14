import pino from 'pino';

import { env } from '@infra/env';

const isTestEnv = env.NODE_ENV === 'test';

const prodLogger = pino({
  level: 'info',
  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
  },
  serializers: {
    info: (info) => {
      const { pid, ...rest } = info;
      return rest;
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

const devLogger = pino({
  level: 'debug',
  ...(isTestEnv
    ? {}
    : {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        },
      }),
});

const loggerInstance = env.NODE_ENV === 'dev' ? devLogger : prodLogger;

class Logger {
  // Futuramente, pode ser integrado com o Kibana ou outro sistema de log
  public info(message: unknown) {
    return loggerInstance.info(message);
  }
  public error(message: unknown) {
    return loggerInstance.error(message);
  }
  public fatal(message: unknown) {
    return loggerInstance.fatal(message);
  }
}

export default new Logger();
