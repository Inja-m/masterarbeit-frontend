// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    runtimeConfig: {
    public: {
			scripts: {
        clarity: {
          id: process.env.NUXT_PUBLIC_SCRIPTS_CLARITY_ID,
        },
			},
      strapiBaseUrl: process.env.STRAPI_URL,
      vapidPublicKey: process.env.VAPID_PUBLIC_KEY
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
   '@nuxtjs/strapi',
	 '@nuxt/scripts'
  ],
  css: ['~/assets/css/main.css'],
	pwa: {
		manifest:{
			name:"CoTrack",
			short_name: "CoTrack",
			description: "Tracking your Co-Design impact",
			start_url: '/',
			icons: [
        {
          src: 'public/icons/icon_64x64.png',
          sizes: '64x64',
          type: 'image/png',
        },{
          src: 'public/icons/icon_192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
      ],
		},
		 workbox: {
			 importScripts: ['/service-worker/push.js'],
      navigateFallback: '/'
    }
	},
	imports: {
    dirs: ['utils']
  }
})