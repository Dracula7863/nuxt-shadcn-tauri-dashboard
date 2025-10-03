// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  // Tauri expects SSG output
  ssr: false,

  modules: [
    '@unocss/nuxt',
    'shadcn-nuxt',
    '@vueuse/nuxt',
    '@nuxt/eslint',
    '@nuxt/icon',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
  ],

  // Let Nuxt auto-import components normally
  // The duplicate warnings are harmless - both .vue and index.ts work fine

  css: [
    '@unocss/reset/tailwind.css',
  ],

  colorMode: {
    classSuffix: '',
  },

  features: {
    // For UnoCSS
    inlineStyles: false,
  },

  eslint: {
    config: {
      standalone: false,
    },
  },

  routeRules: {
    '/components': { redirect: '/components/accordion' },
    '/settings': { redirect: '/settings/profile' },
  },

  imports: {
    dirs: [
      './lib',
    ],
  },

  compatibilityDate: '2024-12-14',

  unocss: {
    // Preflight to handle font loading errors gracefully
    preflight: true,
  },

  vite: {
    // Better support for Tauri CLI output
    clearScreen: false,
    // Enable environment variables with TAURI_ prefix
    envPrefix: ['VITE_', 'TAURI_'],
    server: {
      // Tauri expects a fixed port, fail if that port is not available
      strictPort: true,
    },
  },
})
