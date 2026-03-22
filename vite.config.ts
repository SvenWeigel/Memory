import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        settings: 'src/pages/settings.html',
        game: 'src/pages/game.html',
      },
    },
  },
});