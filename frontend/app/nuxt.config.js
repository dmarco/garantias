const webpack = require('webpack')

module.exports = {

  env: {
    API_URL: process.env.API_ENDPOINT || 'https://cyc-b.dmarcote.avatarla.io/wp-json',
    FRONTEND_DOMAIN: process.env.FRONTEND_DOMAIN || "http://localhost:3000"
  },
  // Build configuration
  build: {
    // Run ESLINT on save
    extend(config, ctx) {
      if (ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
          options: {
            fix: true
          }
        })
      }
    },

    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ],
    vendor: [
      'moment', 'axios', 'vee-validate', 'vuetify', 'element-ui'
    ]
  },
  css: [
    'normalize.css/normalize.css',
    'element-ui/lib/theme-chalk/index.css'
  ],

  // Headers of the page
  head() {
    let canonical = `https://${process.env.FRONTEND_DOMAIN}${this.$route.path}`

    return {
      title: 'CYC',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '' }
      ],

      link: [
        { rel: 'canonical', href: canonical },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  // Customize the progress-bar color
  loading: { color: '#5C6BC0' },
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/vuetify'
  ],
  vuetify: {
    theme: {
      primary: "#5C6BC0",
      secondary: "#C43D95",
      accent: "#EC407A",
      error: "#f44336",
      warning: "#ffeb3b",
      info: "#2196f3",
      success: "#4caf50"
    },
    materialIcons: true,
    css: true
  },
  axios: {
    proxyHeaders: true
  },
  plugins: [
    { src: '~plugins/vue-lazyload', ssr: false },
    { src: '~plugins/vue-scrollto', ssr: false },
    { src: '~plugins/web-font-loader', ssr: false },
    { src: '~plugins/vuetify', ssr: false },
    { src: '~plugins/google-tag-manager', ssr: false },
    { src: '~plugins/mixins' },
    { src: '~plugins/vee-validate' },
    { src: '~plugins/vue2-filters'},
    { src: '~plugins/element-ui'},
    { src: '~plugins/vue-datatables', ssr: false }
  ],

  watchers: {
    webpack: {
      poll: true
    }
  }
}
