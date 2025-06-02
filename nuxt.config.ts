// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
app: {
    head: {
      title: 'CoTrack'
		} 
	},
	runtimeConfig: {
    public: {
      strapiBaseUrl: process.env.STRAPI_URL || 'http://localhost:1337'
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
  ],
  css: ['~/assets/css/main.css'],
	pwa: {
		manifest:{
			name:"CoTrack",
			short_name: "CoTrack",
			description: "Tracking your Co-Design impact",
			icons: [
        {
          src: 'icons/icon_64x64.png',
          sizes: '64x64',
          type: 'image/png',
        },{
          src: 'icons/icon_192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
      ],
		},
		 workbox: {
      navigateFallback: '/'
    },
		devOptions:{
			enabled:true,
			type:"module"
		}
	},
	imports: {
    dirs: ['utils']
  }
})