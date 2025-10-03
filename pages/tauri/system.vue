<script setup lang="ts">
import { arch, platform, type, version } from '@tauri-apps/plugin-os'

definePageMeta({
  title: 'System Information',
})

const systemInfo = ref({
  platform: '',
  arch: '',
  type: '',
  version: '',
  hostname: '',
  locale: '',
})

const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    systemInfo.value = {
      platform: await platform(),
      arch: await arch(),
      type: await type(),
      version: await version(),
      hostname: window.location.hostname || 'localhost',
      locale: navigator.language,
    }
  }
  catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load system information'
    console.error('Error loading system info:', e)
  }
  finally {
    loading.value = false
  }
})

const systemData = computed(() => [
  { label: 'Platform', value: systemInfo.value.platform, icon: 'i-lucide-monitor' },
  { label: 'Architecture', value: systemInfo.value.arch, icon: 'i-lucide-cpu' },
  { label: 'OS Type', value: systemInfo.value.type, icon: 'i-lucide-box' },
  { label: 'OS Version', value: systemInfo.value.version, icon: 'i-lucide-info' },
  { label: 'Hostname', value: systemInfo.value.hostname, icon: 'i-lucide-server' },
  { label: 'Locale', value: systemInfo.value.locale, icon: 'i-lucide-globe' },
])
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">
        System Information
      </h1>
      <p class="mt-2 text-muted-foreground">
        View detailed information about your system using Tauri APIs
      </p>
    </div>

    <BaseBreadcrumbCustom
      :links="[
        { title: 'Tauri', href: '/tauri/system' },
        { title: 'System', href: '/tauri/system' },
      ]"
    />

    <div v-if="loading" class="grid gap-4 lg:grid-cols-3 md:grid-cols-2">
      <Card v-for="i in 6" :key="i">
        <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
          <Skeleton class="h-4 w-24" />
        </CardHeader>
        <CardContent>
          <Skeleton class="h-7 w-32" />
        </CardContent>
      </Card>
    </div>

    <Alert v-else-if="error" variant="destructive">
      <Icon name="i-lucide-alert-circle" class="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {{ error }}
      </AlertDescription>
    </Alert>

    <div v-else class="grid gap-4 lg:grid-cols-3 md:grid-cols-2">
      <Card v-for="item in systemData" :key="item.label">
        <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle class="text-sm font-medium">
            {{ item.label }}
          </CardTitle>
          <Icon :name="item.icon" class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            {{ item.value || 'N/A' }}
          </div>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>About</CardTitle>
        <CardDescription>
          This page demonstrates Tauri's OS information APIs integrated with shadcn-vue components
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-2">
        <div class="flex items-start gap-2">
          <Icon name="i-lucide-info" class="mt-0.5 h-5 w-5 text-muted-foreground" />
          <div class="text-sm text-muted-foreground">
            <p>The system information is retrieved using Tauri's <code class="rounded bg-muted px-1 py-0.5">@tauri-apps/plugin-os</code> plugin.</p>
          </div>
        </div>
        <div class="flex items-start gap-2">
          <Icon name="i-lucide-shield-check" class="mt-0.5 h-5 w-5 text-muted-foreground" />
          <div class="text-sm text-muted-foreground">
            <p>All information is gathered locally without any external API calls for maximum privacy and performance.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
