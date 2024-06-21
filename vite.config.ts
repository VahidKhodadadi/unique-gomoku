import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      includeAssets: ['favicons/gomoku-favicon-color-16.png', 'favicons/gomoku-favicon-color-32.png', 'favicons/gomoku-favicon-color-64.png', 'favicons/gomoku-favicon-color-96.png', 'favicons/gomoku-favicon-color-128.png'],
      manifest: {
        name: 'Unique Gomoku app',
        short_name: 'Unique Gomoku',
        description: 'Gomoku game',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'favicons/gomoku-favicon-color-16.png',
            sizes: '16x16',
            type: 'image/png'
          },
          {
            src: 'favicons/gomoku-favicon-color-32.png',
            sizes: '32x32',
            type: 'image/png'
          },
          {
            src: 'favicons/gomoku-favicon-color-64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: 'favicons/gomoku-favicon-color-96.png',
            sizes: '96x96',
            type: 'image/png'
          },
          {
            src: 'favicons/gomoku-favicon-color-128.png',
            sizes: '128x128',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
