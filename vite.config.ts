import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig(({ command }) => {
  return {
    define: command === 'build' ? {
      'console.log': '(() => {})',
    } : {},
    build: {
      lib: {
        entry: resolve(__dirname, 'resources/js/index.ts'),
        name: 'LivewireOptimisticActions',
        fileName: () => 'livewire-optimistic-actions.js',
        formats: ['es', 'umd']
      },
      rollupOptions: {
        external: [],
        output: {
          globals: {}
        }
      }
    },
    plugins: [
      dts({
        insertTypesEntry: true,
      })
    ]
  };
});
