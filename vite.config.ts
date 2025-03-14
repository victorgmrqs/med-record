import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    setupFiles: ['./src/tests/helpers/setup.ts'],
    coverage: {
      include: ['src/'],
    },
    // Executar os testes de forma sequencial para evitar conflitos com o banco de dados
    sequence: {
      shuffle: false,
      concurrent: false,
    },
    // Forçar execução em um único fork para evitar concorrência
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    testTimeout: 10000,
  },
});
