// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: {
    enabled: true,
  },
  modules: [
    'vuetify-nuxt-module',
  ],
  css: [
    '~/assets/css/main.css',
  ],
  vuetify: {
    moduleOptions: {
      importComposables: false,
      enableRules: false,
      styles: {
        colors: false,
        utilities: false,
      },
    },
    vuetifyOptions: {
      icons: false,
      theme: {
        defaultTheme: 'rollinLight',
        themes: {
          rollinLight: {
            dark: false,
            colors: {
              background: '#f3f5f7',
              surface: '#ffffff',
              primary: '#ff7457',
              'primary-darken-1': '#f06449',
              'on-primary': '#ffffff',
              'on-surface': '#17191c',
            },
          },
        },
      },
      defaults: {
        VBtn: {
          elevation: 0,
        },
      },
    },
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'uk',
      },

      titleTemplate: '%s · ROLLIN’',

      meta: [
        {
          name: 'description',
          content: 'Свіжі роли та суші від ROLLIN’',
        },
      ],

      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon.png',
        },
      ],
    },
  },
})
