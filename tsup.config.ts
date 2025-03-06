import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src', '!src/**/*.spec.ts', '!src/docs', '!src/swagger.json', '!k8s', '!kind'],
  splitting: false,
  sourcemap: false,
  clean: true,
  bundle: true,
  skipNodeModulesBundle: true,
});
