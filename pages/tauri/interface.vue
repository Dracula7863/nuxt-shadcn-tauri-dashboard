<script setup lang="ts">
import { getCurrentWindow } from '@tauri-apps/api/window'

definePageMeta({
  title: 'Interface',
})

const appWindow = getCurrentWindow()

const isFullscreen = ref(false)
const isMaximized = ref(false)
const windowTitle = ref('Nuxt Shadcn Dashboard')
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)

onMounted(async () => {
  try {
    isFullscreen.value = await appWindow.isFullscreen()
    isMaximized.value = await appWindow.isMaximized()
  }
  catch (e) {
    console.error('Error getting window state:', e)
  }
})

async function toggleFullscreen() {
  try {
    await appWindow.setFullscreen(!isFullscreen.value)
    isFullscreen.value = await appWindow.isFullscreen()
    successMessage.value = isFullscreen.value ? 'Entered fullscreen' : 'Exited fullscreen'
    setTimeout(() => successMessage.value = null, 2000)
  }
  catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to toggle fullscreen'
    console.error('Error toggling fullscreen:', e)
    setTimeout(() => error.value = null, 3000)
  }
}

async function toggleMaximize() {
  try {
    await appWindow.toggleMaximize()
    isMaximized.value = await appWindow.isMaximized()
    successMessage.value = isMaximized.value ? 'Window maximized' : 'Window restored'
    setTimeout(() => successMessage.value = null, 2000)
  }
  catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to toggle maximize'
    console.error('Error toggling maximize:', e)
    setTimeout(() => error.value = null, 3000)
  }
}

async function minimizeWindow() {
  try {
    await appWindow.minimize()
    successMessage.value = 'Window minimized'
    setTimeout(() => successMessage.value = null, 2000)
  }
  catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to minimize window'
    console.error('Error minimizing window:', e)
    setTimeout(() => error.value = null, 3000)
  }
}

async function centerWindow() {
  try {
    await appWindow.center()
    successMessage.value = 'Window centered'
    setTimeout(() => successMessage.value = null, 2000)
  }
  catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to center window'
    console.error('Error centering window:', e)
    setTimeout(() => error.value = null, 3000)
  }
}

async function setWindowTitle() {
  try {
    await appWindow.setTitle(windowTitle.value)
    successMessage.value = 'Title updated'
    setTimeout(() => successMessage.value = null, 2000)
  }
  catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to set title'
    console.error('Error setting title:', e)
    setTimeout(() => error.value = null, 3000)
  }
}

async function requestUserAttention() {
  try {
    await appWindow.setFocus()
    successMessage.value = 'Window focused'
    setTimeout(() => successMessage.value = null, 2000)
  }
  catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to focus window'
    console.error('Error focusing window:', e)
    setTimeout(() => error.value = null, 3000)
  }
}

const windowActions = [
  {
    title: 'Toggle Fullscreen',
    description: 'Enter or exit fullscreen mode',
    icon: 'i-lucide-maximize',
    action: toggleFullscreen,
    variant: 'default' as const,
  },
  {
    title: 'Toggle Maximize',
    description: 'Maximize or restore window',
    icon: 'i-lucide-square',
    action: toggleMaximize,
    variant: 'default' as const,
  },
  {
    title: 'Minimize',
    description: 'Minimize the window',
    icon: 'i-lucide-minimize-2',
    action: minimizeWindow,
    variant: 'secondary' as const,
  },
  {
    title: 'Center Window',
    description: 'Center window on screen',
    icon: 'i-lucide-align-center-vertical',
    action: centerWindow,
    variant: 'secondary' as const,
  },
  {
    title: 'Request Attention',
    description: 'Flash taskbar icon',
    icon: 'i-lucide-bell-ring',
    action: requestUserAttention,
    variant: 'outline' as const,
  },
]
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">
        Interface Controls
      </h1>
      <p class="text-muted-foreground mt-2">
        Control window behavior and appearance using Tauri's window API
      </p>
    </div>

    <BaseBreadcrumbCustom
      :links="[
        { title: 'Tauri', href: '/tauri/interface' },
        { title: 'Interface', href: '/tauri/interface' },
      ]"
    />

    <Alert v-if="error" variant="destructive">
      <Icon name="i-lucide-alert-circle" class="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {{ error }}
      </AlertDescription>
    </Alert>

    <Alert v-if="successMessage">
      <Icon name="i-lucide-check-circle-2" class="h-4 w-4" />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>
        {{ successMessage }}
      </AlertDescription>
    </Alert>

    <!-- Window State -->
    <Card>
      <CardHeader>
        <CardTitle>Window State</CardTitle>
        <CardDescription>
          Current window status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4 md:grid-cols-2">
          <div class="flex items-center justify-between p-3 rounded-lg border">
            <div class="flex items-center gap-2">
              <Icon name="i-lucide-maximize" class="h-4 w-4 text-muted-foreground" />
              <span class="text-sm font-medium">Fullscreen</span>
            </div>
            <Badge :variant="isFullscreen ? 'default' : 'secondary'">
              {{ isFullscreen ? 'Yes' : 'No' }}
            </Badge>
          </div>
          <div class="flex items-center justify-between p-3 rounded-lg border">
            <div class="flex items-center gap-2">
              <Icon name="i-lucide-square" class="h-4 w-4 text-muted-foreground" />
              <span class="text-sm font-medium">Maximized</span>
            </div>
            <Badge :variant="isMaximized ? 'default' : 'secondary'">
              {{ isMaximized ? 'Yes' : 'No' }}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Window Title -->
    <Card>
      <CardHeader>
        <CardTitle>Window Title</CardTitle>
        <CardDescription>
          Customize the window title
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form class="flex gap-2" @submit.prevent="setWindowTitle">
          <Input
            v-model="windowTitle"
            placeholder="Enter window title"
            class="flex-1"
          />
          <Button type="submit">
            <Icon name="i-lucide-type" class="mr-2 h-4 w-4" />
            Set Title
          </Button>
        </form>
      </CardContent>
    </Card>

    <!-- Window Actions -->
    <Card>
      <CardHeader>
        <CardTitle>Window Actions</CardTitle>
        <CardDescription>
          Control window behavior
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <Card
            v-for="item in windowActions"
            :key="item.title"
            class="cursor-pointer hover:bg-accent transition-colors"
            @click="item.action"
          >
            <CardHeader class="pb-3">
              <div class="flex items-start gap-3">
                <div class="p-2 rounded-lg bg-primary/10">
                  <Icon :name="item.icon" class="h-5 w-5 text-primary" />
                </div>
                <div class="flex-1">
                  <CardTitle class="text-sm">{{ item.title }}</CardTitle>
                  <CardDescription class="text-xs mt-1">
                    {{ item.description }}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>About Window API</CardTitle>
      </CardHeader>
      <CardContent class="space-y-2">
        <div class="flex items-start gap-2">
          <Icon name="i-lucide-info" class="h-5 w-5 text-muted-foreground mt-0.5" />
          <div class="text-sm text-muted-foreground">
            <p>These controls use Tauri's window management API to interact with the native window.</p>
          </div>
        </div>
        <div class="flex items-start gap-2">
          <Icon name="i-lucide-monitor" class="h-5 w-5 text-muted-foreground mt-0.5" />
          <div class="text-sm text-muted-foreground">
            <p>All actions are performed natively for better performance and integration with the OS.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
