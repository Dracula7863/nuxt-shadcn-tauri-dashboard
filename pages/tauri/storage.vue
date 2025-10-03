<script setup lang="ts">
definePageMeta({
  title: 'Storage',
})

const storageItems = ref<Array<{ key: string, value: string }>>([])
const loading = ref(true)
const error = ref<string | null>(null)

// Form state
const newKey = ref('')
const newValue = ref('')
const isAddingItem = ref(false)

let storeModule: any = null

onMounted(async () => {
  try {
    // Dynamically import the store module
    storeModule = await import('@tauri-apps/plugin-store')
    await loadItems()
  }
  catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to initialize storage'
    console.error('Error initializing storage:', e)
  }
  finally {
    loading.value = false
  }
})

async function loadItems() {
  if (!storeModule)
    return

  try {
    const store = await storeModule.load('store.json')
    const entries = await store.entries()
    
    storageItems.value = entries.map(([key, value]: [string, any]) => ({
      key: String(key),
      value: typeof value === 'string' ? value : JSON.stringify(value),
    }))
  }
  catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load storage items'
    console.error('Error loading items:', e)
  }
}

async function addItem() {
  if (!storeModule || !newKey.value || !newValue.value)
    return

  isAddingItem.value = true
  error.value = null
  
  try {
    const store = await storeModule.load('store.json')
    await store.set(newKey.value, newValue.value)
    await store.save()
    
    await loadItems()
    newKey.value = ''
    newValue.value = ''
  }
  catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to add item'
    console.error('Error adding item:', e)
  }
  finally {
    isAddingItem.value = false
  }
}

async function deleteItem(key: string) {
  if (!storeModule)
    return

  try {
    const store = await storeModule.load('store.json')
    await store.delete(key)
    await store.save()
    await loadItems()
  }
  catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to delete item'
    console.error('Error deleting item:', e)
  }
}

async function clearAll() {
  if (!storeModule)
    return

  try {
    const store = await storeModule.load('store.json')
    await store.clear()
    await store.save()
    storageItems.value = []
  }
  catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to clear storage'
    console.error('Error clearing storage:', e)
  }
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">
        Storage
      </h1>
      <p class="text-muted-foreground mt-2">
        Persistent key-value storage using Tauri Store plugin
      </p>
    </div>

    <BaseBreadcrumbCustom
      :links="[
        { title: 'Tauri', href: '/tauri/storage' },
        { title: 'Storage', href: '/tauri/storage' },
      ]"
    />

    <Alert v-if="error" variant="destructive">
      <Icon name="i-lucide-alert-circle" class="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {{ error }}
      </AlertDescription>
    </Alert>

    <!-- Add Item Form -->
    <Card>
      <CardHeader>
        <CardTitle>Add New Item</CardTitle>
        <CardDescription>
          Store a new key-value pair
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form class="grid gap-4" @submit.prevent="addItem">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="key">Key</Label>
              <Input
                id="key"
                v-model="newKey"
                placeholder="my-key"
                required
              />
            </div>
            <div class="space-y-2">
              <Label for="value">Value</Label>
              <Input
                id="value"
                v-model="newValue"
                placeholder="my-value"
                required
              />
            </div>
          </div>
          <div class="flex gap-2">
            <Button type="submit" :disabled="isAddingItem || !newKey || !newValue">
              <Icon v-if="isAddingItem" name="i-lucide-loader-2" class="mr-2 h-4 w-4 animate-spin" />
              <Icon v-else name="i-lucide-plus" class="mr-2 h-4 w-4" />
              Add Item
            </Button>
            <Button
              v-if="storageItems.length > 0"
              type="button"
              variant="destructive"
              @click="clearAll"
            >
              <Icon name="i-lucide-trash-2" class="mr-2 h-4 w-4" />
              Clear All
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>

    <!-- Storage Items Table -->
    <Card>
      <CardHeader>
        <CardTitle>Stored Items</CardTitle>
        <CardDescription>
          {{ storageItems.length }} item(s) in storage
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="loading" class="flex items-center justify-center py-8">
          <Icon name="i-lucide-loader-2" class="h-8 w-8 animate-spin text-muted-foreground" />
        </div>

        <div v-else-if="storageItems.length === 0" class="flex flex-col items-center justify-center py-8 text-center">
          <Icon name="i-lucide-database" class="h-12 w-12 text-muted-foreground mb-4" />
          <p class="text-sm text-muted-foreground">
            No items in storage. Add your first item above.
          </p>
        </div>

        <Table v-else>
          <TableHeader>
            <TableRow>
              <TableHead>Key</TableHead>
              <TableHead>Value</TableHead>
              <TableHead class="text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="item in storageItems" :key="item.key">
              <TableCell class="font-mono text-sm">
                {{ item.key }}
              </TableCell>
              <TableCell class="font-mono text-sm">
                {{ item.value }}
              </TableCell>
              <TableCell class="text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  @click="deleteItem(item.key)"
                >
                  <Icon name="i-lucide-trash-2" class="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>
