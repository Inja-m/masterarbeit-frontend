// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	runtimeConfig: {
    public: {
      strapiBaseUrl: process.env.STRAPI_URL
    }
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
   '@nuxt/content',
   '@nuxt/eslint',
   '@nuxt/fonts',
   '@nuxt/icon',
   '@nuxt/image',
   '@nuxt/scripts',
   '@nuxt/test-utils',
   '@nuxt/ui',
   '@vite-pwa/nuxt',
   '@nuxtjs/strapi'
  ], pwa: {
    registerType: 'autoUpdate',
    includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
    manifest: {
      name: 'CoTrack',
      short_name: 'CoTrack',
      start_url: '/',
      display: 'standalone',
      icons: [
        {
          src: '/assets/icon.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/assets/icon.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
    workbox: {
      navigateFallback: '/', 
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'], 
    },
  },
  css: ['~/assets/css/main.css'],
	imports: {
    dirs: ['utils']
  }
})