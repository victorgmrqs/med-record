import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    setupFiles: ['./src/tests/helpers/setup.ts'],
    coverage: {
      include: ['src/application'],
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
