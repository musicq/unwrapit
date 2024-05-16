import {defineConfig} from 'vitest/config'

export default defineConfig({
  test: {
    root: '.',
    includeSource: ['src/**/*.ts'],
    globals: true,
    coverage: {
      include: ['src/**/*.ts'],
      reporter: ['clover', 'text', 'json', 'html'],
    },
  },
})
