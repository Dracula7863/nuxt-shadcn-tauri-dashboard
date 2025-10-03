import type { Theme } from '@/lib/registry/themes'
import { themes } from '@/lib/registry/themes'

interface Config {
  theme?: Theme['name']
  radius: number
}

const STORAGE_KEY = 'theme-config'

export function useCustomize() {
  const { value: color } = useColorMode()
  const isDark = color === 'dark'

  // Default config
  const defaultConfig: Config = {
    theme: 'zinc',
    radius: 0.5,
  }

  const config = ref<Config>(defaultConfig)
  const isTauri = ref(false)
  let store: any = null

  // Initialize storage
  onMounted(async () => {
    // Check if running in Tauri
    if ((window as any).__TAURI__) {
      isTauri.value = true
      try {
        const { load } = await import('@tauri-apps/plugin-store')
        store = await load('settings.json')

        // Load saved config from Tauri store
        const savedConfig = await store.get(STORAGE_KEY)
        if (savedConfig) {
          config.value = { ...defaultConfig, ...savedConfig }
        }

        console.warn('Loaded theme config from Tauri store:', config.value)
      }
      catch (e) {
        console.error('Error loading Tauri store:', e)
        isTauri.value = false
      }
    }

    // Fall back to localStorage for web mode
    if (!isTauri.value) {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          config.value = { ...defaultConfig, ...JSON.parse(saved) }
          console.warn('Loaded theme config from localStorage:', config.value)
        }
        catch (e) {
          console.error('Error parsing saved config:', e)
        }
      }
    }
  })

  // Save config whenever it changes
  async function saveConfig() {
    if (isTauri.value && store) {
      try {
        await store.set(STORAGE_KEY, config.value)
        await store.save()
        console.warn('Saved theme config to Tauri store:', config.value)
      }
      catch (e) {
        console.error('Error saving to Tauri store:', e)
      }
    }
    else {
      // Save to localStorage for web mode
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config.value))
      console.warn('Saved theme config to localStorage:', config.value)
    }
  }

  const themeClass = computed(() => `theme-${config.value.theme}`)
  const theme = computed(() => config.value.theme)
  const radius = computed(() => config.value.radius)

  function setTheme(themeName: Theme['name']) {
    config.value.theme = themeName
    saveConfig()
  }

  function setRadius(newRadius: number) {
    config.value.radius = newRadius
    saveConfig()
  }

  const themePrimary = computed(() => {
    const t = themes.find(t => t.name === theme.value)
    return `hsl(${
      t?.cssVars[isDark ? 'dark' : 'light'].primary
    })`
  })

  return {
    themeClass,
    theme,
    setTheme,
    radius,
    setRadius,
    themePrimary,
  }
}
