<script setup lang="ts">
import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs'
import { open, save } from '@tauri-apps/plugin-dialog'

definePageMeta({
  title: 'Filesystem',
})

const fileContent = ref('')
const currentFilePath = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)

async function openFile() {
  loading.value = true
  error.value = null
  try {
    const selected = await open({
      multiple: false,
      filters: [{
        name: 'Text',
        extensions: ['txt', 'md', 'json', 'js', 'ts', 'vue', 'html', 'css'],
      }],
    })

    if (selected && typeof selected === 'string') {
      currentFilePath.value = selected
      fileContent.value = await readTextFile(selected)
      successMessage.value = 'File loaded successfully'
      setTimeout(() => successMessage.value = null, 3000)
    }
  }
  catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to open file'
    console.error('Error opening file:', e)
  }
  finally {
    loading.value = false
  }
}

async function saveFile() {
  loading.value = true
  error.value = null
  try {
    let filePath = currentFilePath.value

    if (!filePath) {
      const selected = await save({
        filters: [{
          name: 'Text',
          extensions: ['txt'],
        }],
      })
      if (!selected)
        return
      filePath = selected
    }

    await writeTextFile(filePath, fileContent.value)
    currentFilePath.value = filePath
    successMessage.value = 'File saved successfully'
    setTimeout(() => successMessage.value = null, 3000)
  }
  catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to save file'
    console.error('Error saving file:', e)
  }
  finally {
    loading.value = false
  }
}

function newFile() {
  currentFilePath.value = ''
  fileContent.value = ''
  error.value = null
  successMessage.value = null
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">
        Filesystem
      </h1>
      <p class="text-muted-foreground mt-2">
        Read and write files using Tauri's filesystem API
      </p>
    </div>

    <BaseBreadcrumbCustom
      :links="[
        { title: 'Tauri', href: '/tauri/filesystem' },
        { title: 'Filesystem', href: '/tauri/filesystem' },
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

    <Card>
      <CardHeader>
        <CardTitle>File Operations</CardTitle>
        <CardDescription>
          <span v-if="currentFilePath" class="font-mono text-xs">{{ currentFilePath }}</span>
          <span v-else>No file selected</span>
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex gap-2">
          <Button @click="newFile" variant="outline">
            <Icon name="i-lucide-file-plus" class="mr-2 h-4 w-4" />
            New
          </Button>
          <Button @click="openFile" :disabled="loading">
            <Icon v-if="loading" name="i-lucide-loader-2" class="mr-2 h-4 w-4 animate-spin" />
            <Icon v-else name="i-lucide-folder-open" class="mr-2 h-4 w-4" />
            Open
          </Button>
          <Button @click="saveFile" :disabled="loading || !fileContent">
            <Icon v-if="loading" name="i-lucide-loader-2" class="mr-2 h-4 w-4 animate-spin" />
            <Icon v-else name="i-lucide-save" class="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>

        <div class="space-y-2">
          <Label for="content">File Content</Label>
          <Textarea
            id="content"
            v-model="fileContent"
            placeholder="Type something or open a file..."
            class="min-h-[400px] font-mono text-sm"
          />
          <p class="text-xs text-muted-foreground">
            {{ fileContent.length }} characters
          </p>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>About Filesystem API</CardTitle>
      </CardHeader>
      <CardContent class="space-y-2">
        <div class="flex items-start gap-2">
          <Icon name="i-lucide-shield-check" class="h-5 w-5 text-muted-foreground mt-0.5" />
          <div class="text-sm text-muted-foreground">
            <p>File operations are sandboxed and require user permission through system dialogs.</p>
          </div>
        </div>
        <div class="flex items-start gap-2">
          <Icon name="i-lucide-file-text" class="h-5 w-5 text-muted-foreground mt-0.5" />
          <div class="text-sm text-muted-foreground">
            <p>Supported file types: .txt, .md, .json, .js, .ts, .vue, .html, .css</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
