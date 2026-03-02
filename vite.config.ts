import { defineConfig } from 'vite'
import path from 'node:path'

export default defineConfig({
  root: 'dist',
  build: {
    outDir: '.',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'dist/index.html'),
        embed: path.resolve(__dirname, 'dist/embed.html'),
        multi: path.resolve(__dirname, 'dist/multi.html'),
        '2p': path.resolve(__dirname, 'dist/2p.html'),
        mockup: path.resolve(__dirname, 'dist/mockup.html'),
        redirect: path.resolve(__dirname, 'dist/redirect.html'),
        'diagrams/diagrams': path.resolve(__dirname, 'dist/diagrams/diagrams.html'),
        'diagrams/diamond': path.resolve(__dirname, 'dist/diagrams/diamond.html'),
        'diagrams/gemini': path.resolve(__dirname, 'dist/diagrams/gemini.html'),
        'diagrams/mathaven': path.resolve(__dirname, 'dist/diagrams/mathaven.html'),
        'diagrams/nineball': path.resolve(__dirname, 'dist/diagrams/nineball.html'),
        'diagrams/odd': path.resolve(__dirname, 'dist/diagrams/odd.html'),
        'diagrams/plot': path.resolve(__dirname, 'dist/diagrams/plot.html'),
        'diagrams/roll': path.resolve(__dirname, 'dist/diagrams/roll.html'),
        'diagrams/symmetry': path.resolve(__dirname, 'dist/diagrams/symmetry.html'),
      },
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `chunks/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`,
      }
    }
  },
  server: {
    port: 8080,
    fs: {
      allow: ['..']
    }
  },
  resolve: {
    alias: {
      '/src': path.resolve(__dirname, 'src')
    }
  }
})
