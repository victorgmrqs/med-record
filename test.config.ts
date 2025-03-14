import { vi } from 'vitest';
import { defineConfig } from 'vitest/config';

vi.mock('@infra/index', () => ({
  env: {
    // Configurar variáveis de ambiente específicas para teste
    DATABASE_URL: process.env.TEST_DATABASE_URL || 'mysql://root:root@localhost:3306/test_database',
    NODE_ENV: 'test',
  },
}));

// Evitar execução em paralelo
process.env.VITEST_POOL_FORCE_THREAD = 'true';

export default defineConfig({
  test: {
    include: ['src/**/*.spec.ts'],
    setupFiles: ['src/tests/helpers/setup.ts'],
    sequence: {
      concurrent: false,
    },
  },
});
