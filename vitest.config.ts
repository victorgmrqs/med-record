import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    setupFiles: ['./src/tests/helpers/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['json', 'lcov'],
      include: ['src/'],
      exclude: [
        'prisma',
        'src/shared/*',
        'src/tests/*',
        'src/infra/*',
        'src/adapters/http/server.ts',
        'src/adapters/database/prisma/client.ts',
        '**/*.spec.ts',
      ],
    },
    sequence: {
      shuffle: false,
      concurrent: false,
    },
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    testTimeout: 10000,
  },
});
