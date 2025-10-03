<script setup lang="ts">
const route = useRoute()
const isFullscreen = ref(false)
const isTauri = ref(false)

let appWindow: any = null

function setLinks() {
  if (route.fullPath === '/') {
    return [{ title: 'Home', href: '/' }]
  }

  const segments = route.fullPath.split('/').filter(item => item !== '')

  const breadcrumbs = segments.map((item, index) => {
    const str = item.replace(/-/g, ' ')
    const title = str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')

    return {
      title,
      href: `/${segments.slice(0, index + 1).join('/')}`,
    }
  })

  return [{ title: 'Home', href: '/' }, ...breadcrumbs]
}

const links = ref<{
  title: string
  href: string
}[]>(setLinks())

watch(() => route.fullPath, (val) => {
  if (val) {
    links.value = setLinks()
  }
})

onMounted(async () => {
  // Check if running in Tauri - try multiple detection methods
  const hasTauri = !!(window as any).__TAURI__ || !!(window as any).__TAURI_INTERNALS__
  console.warn('Checking Tauri environment:', {
    __TAURI__: (window as any).__TAURI__,
    __TAURI_INTERNALS__: (window as any).__TAURI_INTERNALS__,
    detected: hasTauri,
  })

  if (hasTauri) {
    console.warn('Tauri detected, initializing window controls')
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window')
      appWindow = getCurrentWindow()
      isFullscreen.value = await appWindow.isFullscreen()
      isTauri.value = true // Set this AFTER successful initialization
      console.warn('Tauri window initialized. Fullscreen state:', isFullscreen.value, 'isTauri:', isTauri.value)
    }
    catch (e) {
      console.error('Error initializing Tauri window:', e)
      isTauri.value = false
    }
  }
  else {
    console.warn('Not running in Tauri mode - window.__TAURI__ not found')
  }
})

async function toggleFullscreen() {
  if (!isTauri.value || !appWindow)
    return

  try {
    await appWindow.setFullscreen(!isFullscreen.value)
    isFullscreen.value = await appWindow.isFullscreen()
  }
  catch (e) {
    console.error('Error toggling fullscreen:', e)
  }
}
</script>

<template>
  <header class="sticky top-0 z-10 h-53px flex items-center gap-4 border-b bg-background px-4 md:px-6">
    <div class="w-full flex items-center gap-4">
      <SidebarTrigger />
      <Separator orientation="vertical" class="h-4" />
      <BaseBreadcrumbCustom :links="links" />
    </div>
    <div class="ml-auto flex items-center gap-2">
      <Button
        v-if="isTauri"
        variant="ghost"
        size="icon"
        title="Toggle Fullscreen"
        @click="toggleFullscreen"
      >
        <Icon v-if="isFullscreen" name="i-lucide-minimize" class="h-5 w-5" />
        <Icon v-else name="i-lucide-maximize" class="h-5 w-5" />
      </Button>
      <slot />
    </div>
  </header>
</template>

<style scoped>

</style>
