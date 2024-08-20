import { defineConfig } from 'vite';
import { globSync } from 'glob';

export default defineConfig({
  base: 'https://andrewkonon.github.io/checkngo.pro/',
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        ...globSync('./es/*').reduce((entries, entry) => {
          const name = entry.replace('./es/', '').replace(/\.[^/.]+$/, '');
          entries[name] = entry;
          return entries;
        }, {})
      }
    }
  },
  
});
