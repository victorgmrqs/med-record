import { vi } from 'vitest';
import { defineConfig } from 'vitest/config';

vi.mock('@infra/index', () => ({
  env: {},
}));
export default defineConfig({
  test: {
    include: ['src/tests/**/*.spec.ts'],
    setupFiles: ['src/tests/helpers/setup.ts'],
  },
});
