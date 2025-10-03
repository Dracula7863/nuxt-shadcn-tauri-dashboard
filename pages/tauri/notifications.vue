<script setup lang="ts">
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from '@tauri-apps/plugin-notification'

definePageMeta({
  title: 'Notifications',
})

const title = ref('Hello from Tauri!')
const body = ref('This is a notification from your Nuxt + Tauri app')
const permissionGranted = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)

onMounted(async () => {
  try {
    permissionGranted.value = await isPermissionGranted()
  }
  catch (e) {
    console.error('Error checking notification permission:', e)
  }
})

async function requestNotificationPermission() {
  loading.value = true
  error.value = null
  try {
    const permission = await requestPermission()
    permissionGranted.value = permission === 'granted'

    if (permissionGranted.value) {
      successMessage.value = 'Notification permission granted!'
    }
    else {
      error.value = 'Notification permission denied'
    }
    setTimeout(() => {
      successMessage.value = null
      error.value = null
    }, 3000)
  }
  catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to request permission'
    console.error('Error requesting permission:', e)
  }
  finally {
    loading.value = false
  }
}

async function send() {
  if (!permissionGranted.value) {
    error.value = 'Permission not granted. Please grant notification permission first.'
    setTimeout(() => error.value = null, 3000)
    return
  }

  loading.value = true
  error.value = null
  try {
    await sendNotification({ title: title.value, body: body.value })
    successMessage.value = 'Notification sent!'
    setTimeout(() => successMessage.value = null, 3000)
  }
  catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to send notification'
    console.error('Error sending notification:', e)
  }
  finally {
    loading.value = false
  }
}

const notificationExamples = [
  {
    title: 'Welcome!',
    body: 'Thanks for using our application',
    icon: 'i-lucide-smile',
  },
  {
    title: 'Task Complete',
    body: 'Your task has been successfully completed',
    icon: 'i-lucide-check-circle-2',
  },
  {
    title: 'New Message',
    body: 'You have 3 unread messages',
    icon: 'i-lucide-mail',
  },
  {
    title: 'Update Available',
    body: 'A new version is ready to install',
    icon: 'i-lucide-download',
  },
]

function useExample(example: typeof notificationExamples[0]) {
  title.value = example.title
  body.value = example.body
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">
        Notifications
      </h1>
      <p class="text-muted-foreground mt-2">
        Send system notifications using Tauri's notification plugin
      </p>
    </div>

    <BaseBreadcrumbCustom
      :links="[
        { title: 'Tauri', href: '/tauri/notifications' },
        { title: 'Notifications', href: '/tauri/notifications' },
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

    <!-- Permission Status -->
    <Card>
      <CardHeader>
        <CardTitle>Permission Status</CardTitle>
        <CardDescription>
          Notifications require system permission
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Badge :variant="permissionGranted ? 'default' : 'secondary'">
              {{ permissionGranted ? 'Granted' : 'Not Granted' }}
            </Badge>
            <span class="text-sm text-muted-foreground">
              {{ permissionGranted ? 'You can send notifications' : 'Request permission to send notifications' }}
            </span>
          </div>
          <Button
            v-if="!permissionGranted"
            @click="requestNotificationPermission"
            :disabled="loading"
          >
            <Icon v-if="loading" name="i-lucide-loader-2" class="mr-2 h-4 w-4 animate-spin" />
            Request Permission
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Send Notification -->
    <Card>
      <CardHeader>
        <CardTitle>Send Notification</CardTitle>
        <CardDescription>
          Customize and send a system notification
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form class="space-y-4" @submit.prevent="send">
          <div class="space-y-2">
            <Label for="title">Title</Label>
            <Input
              id="title"
              v-model="title"
              placeholder="Notification title"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="body">Body</Label>
            <Textarea
              id="body"
              v-model="body"
              placeholder="Notification message"
              rows="3"
              required
            />
          </div>
          <Button type="submit" :disabled="loading || !permissionGranted">
            <Icon v-if="loading" name="i-lucide-loader-2" class="mr-2 h-4 w-4 animate-spin" />
            <Icon v-else name="i-lucide-bell" class="mr-2 h-4 w-4" />
            Send Notification
          </Button>
        </form>
      </CardContent>
    </Card>

    <!-- Examples -->
    <Card>
      <CardHeader>
        <CardTitle>Quick Examples</CardTitle>
        <CardDescription>
          Try these pre-configured notifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4 md:grid-cols-2">
          <Card
            v-for="example in notificationExamples"
            :key="example.title"
            class="cursor-pointer hover:bg-accent transition-colors"
            @click="useExample(example)"
          >
            <CardHeader class="pb-3">
              <div class="flex items-start gap-3">
                <div class="p-2 rounded-lg bg-primary/10">
                  <Icon :name="example.icon" class="h-5 w-5 text-primary" />
                </div>
                <div class="flex-1">
                  <CardTitle class="text-base">{{ example.title }}</CardTitle>
                  <CardDescription class="text-sm mt-1">
                    {{ example.body }}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
