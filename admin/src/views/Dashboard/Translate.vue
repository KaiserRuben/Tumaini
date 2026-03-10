<template>
  <div>
    <ProgressBar v-if="loading" mode="indeterminate" style="height: 4px" />

    <Tabs v-model:value="activeTab">
      <TabList>
        <Tab value="data">Data</Tab>
        <Tab value="settings">Settings</Tab>
      </TabList>
      <TabPanels>
        <!-- Data Tab -->
        <TabPanel value="data">
          <div class="page-header">
            <h2>Text Data</h2>
            <div class="page-actions">
              <IconField>
                <InputIcon class="pi pi-search" />
                <InputText v-model="globalFilter" placeholder="Search..." />
              </IconField>
              <Button label="Update Data" icon="pi pi-refresh" @click="loadData" />
            </div>
          </div>

          <DataTable
            :value="filteredData"
            :paginator="true"
            :rows="20"
            :rowsPerPageOptions="[10, 20, 50]"
            :globalFilterFields="['page', 'description', 'EN', 'NL', 'DE']"
            :filterDisplay="'row'"
            editMode="cell"
            @cell-edit-complete="onCellEditComplete"
            sortMode="multiple"
            removableSort
            stripedRows
            dataKey="_id"
          >
            <Column v-if="show.page" field="page" header="Page" sortable style="min-width: 8rem" />
            <Column v-if="show.description" field="description" header="Description" sortable style="min-width: 12rem" />
            <Column v-if="show.EN" field="EN" header="English" sortable style="min-width: 14rem">
              <template #body="{ data }">
                <span class="cell-wrap">{{ data.EN }}</span>
              </template>
              <template #editor="{ data, field }">
                <Textarea v-model="data[field]" rows="3" class="cell-editor" autoResize />
              </template>
            </Column>
            <Column v-if="show.NL" field="NL" header="Dutch" sortable style="min-width: 14rem">
              <template #body="{ data }">
                <span class="cell-wrap">{{ data.NL }}</span>
              </template>
              <template #editor="{ data, field }">
                <Textarea v-model="data[field]" rows="3" class="cell-editor" autoResize />
              </template>
            </Column>
            <Column v-if="show.DE" field="DE" header="German" sortable style="min-width: 14rem">
              <template #body="{ data }">
                <span class="cell-wrap">{{ data.DE }}</span>
              </template>
              <template #editor="{ data, field }">
                <Textarea v-model="data[field]" rows="3" class="cell-editor" autoResize />
              </template>
            </Column>
          </DataTable>
        </TabPanel>

        <!-- Settings Tab -->
        <TabPanel value="settings">
          <div class="settings-card">
            <h3>Show columns</h3>
            <div class="switch-group">
              <div class="switch-item">
                <ToggleSwitch v-model="show.page" />
                <label>Page</label>
              </div>
              <div class="switch-item">
                <ToggleSwitch v-model="show.description" />
                <label>Description</label>
              </div>
              <div class="switch-item">
                <ToggleSwitch v-model="show.EN" />
                <label>English</label>
              </div>
              <div class="switch-item">
                <ToggleSwitch v-model="show.DE" />
                <label>German</label>
              </div>
              <div class="switch-item">
                <ToggleSwitch v-model="show.NL" />
                <label>Dutch</label>
              </div>
            </div>
          </div>

          <div class="settings-card">
            <h3>Show only empty</h3>
            <Select
              v-model="onlyShowEmpty"
              :options="emptyFilterOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Select language"
              @change="applyFilters"
            />
          </div>

          <div class="settings-card">
            <h3>Filter page</h3>
            <Select
              v-model="page"
              :options="pageFilterOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Select page"
              @change="applyFilters"
            />
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { axiosGet, axiosPatch } from '@/utils/axiosWrapper'
import { useNotify } from '@/composables/useNotify'

import DataTable from 'primevue/datatable'
import type { DataTableCellEditCompleteEvent } from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import ToggleSwitch from 'primevue/toggleswitch'
import Select from 'primevue/select'
import ProgressBar from 'primevue/progressbar'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'

export interface IText {
  _id?: string
  page: string
  EN?: string
  DE?: string
  NL?: string
  description?: string
  created?: Date
}

const notify = useNotify()

const activeTab = ref('data')
const loading = ref(false)
const globalFilter = ref('')

const onlyShowEmpty = ref('none')
const page = ref('')

const myData = ref<IText[]>([])
const show = ref({
  page: true,
  description: true,
  EN: true,
  NL: true,
  DE: true,
})

const viewOptions = computed(() => {
  const pages = new Set(myData.value.map(item => item.page))
  return Array.from(pages).sort()
})

const emptyFilterOptions = [
  { label: 'None', value: 'none' },
  { label: 'German', value: 'DE' },
  { label: 'English', value: 'EN' },
  { label: 'Dutch', value: 'NL' },
]

const pageFilterOptions = computed(() => [
  { label: 'None', value: '' },
  ...viewOptions.value.map(v => ({ label: v, value: v })),
])

const filteredData = computed(() => {
  let data = myData.value

  if (onlyShowEmpty.value !== 'none') {
    const lang = onlyShowEmpty.value as 'EN' | 'DE' | 'NL'
    data = data.filter(d => !d[lang])
  }

  if (page.value) {
    data = data.filter(d => d.page === page.value)
  }

  if (globalFilter.value) {
    const search = globalFilter.value.toLowerCase()
    data = data.filter(d =>
      (d.page && d.page.toLowerCase().includes(search)) ||
      (d.description && d.description.toLowerCase().includes(search)) ||
      (d.EN && d.EN.toLowerCase().includes(search)) ||
      (d.NL && d.NL.toLowerCase().includes(search)) ||
      (d.DE && d.DE.toLowerCase().includes(search))
    )
  }

  return data
})

function applyFilters() {
  // filters are reactive via computed, nothing extra needed
}

// Debounced save: collect pending saves and batch them
let saveTimer: ReturnType<typeof setTimeout> | null = null
const pendingSaves = new Map<string, { id: string; language: string; text: string }>()

function debouncedSave(id: string, language: string, text: string) {
  const key = `${id}_${language}`
  pendingSaves.set(key, { id, language, text })

  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(async () => {
    const saves = Array.from(pendingSaves.values())
    pendingSaves.clear()
    for (const s of saves) {
      try {
        await axiosPatch('/text', {
          _id: s.id,
          language: s.language,
          text: s.text,
        })
      } catch (error) {
        notify.error(`Could not save change for ${s.language}: ${error}`)
      }
    }
    if (saves.length) {
      notify.success(`Saved ${saves.length} change(s)`)
    }
  }, 800)
}

function onCellEditComplete(event: DataTableCellEditCompleteEvent) {
  const { data, newValue, field } = event
  if (['EN', 'NL', 'DE'].includes(field) && data._id) {
    if (data[field] !== newValue) {
      data[field] = newValue
      debouncedSave(data._id, field, newValue || '')
    }
  }
}

async function loadData() {
  loading.value = true
  try {
    const res = await axiosGet('/text')
    myData.value = res.data || []
    if (!res.data) {
      notify.warn('Could not load any text data.')
    }
  } catch (error) {
    notify.error(`Failed to load data: ${error}`)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.cell-wrap {
  white-space: pre-wrap;
}

.cell-editor {
  width: 100%;
}

.settings-card {
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid var(--t-surface-cream);
  border-radius: 6px;
}

.settings-card h3 {
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: 1.15rem;
  font-weight: 400;
  color: var(--t-text);
  margin: 0 0 0.25rem;
}

.switch-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.5rem;
}

.switch-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .page-header { flex-wrap: wrap; gap: 0.5rem; }
  .page-actions { width: 100%; justify-content: flex-end; }
}
</style>
