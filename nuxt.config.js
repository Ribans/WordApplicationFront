module.exports = {
  cache: true,
  modules: [
    '@nuxtjs/bootstrap-vue',
  ],
  env: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000'
  }
  head: {
    title: 'word_app',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Ribans Project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  css: [
    '~/assets/css/base.css',
    '~/assets/css/learn.css',
  ],
  loading: { color: '#3B8070' },
}
