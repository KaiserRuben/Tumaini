<template>
  <div>
    <div class="page-header">
      <h2>Donors</h2>
      <div class="page-actions">
        <IconField>
          <InputIcon class="pi pi-search" />
          <InputText v-model="globalFilter" placeholder="Search donors..." />
        </IconField>
        <Button label="Refresh" icon="pi pi-refresh" @click="loadDonors" />
      </div>
    </div>

    <DataTable
      :value="sortedDonors"
      :paginator="true"
      :rows="20"
      :rowsPerPageOptions="[10, 20, 50]"
      rowGroupMode="subheader"
      groupRowsBy="status"
      sortMode="single"
      sortField="status"
      :sortOrder="1"
      :globalFilterFields="['firstName', 'lastName', 'email', 'phone', 'address']"
      stripedRows
      dataKey="_id"
    >
      <template #groupheader="{ data }">
        <strong>{{ statusLabel(data.status) }}</strong>
      </template>

      <Column field="firstName" header="Name" sortable style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.firstName }} {{ data.lastName }}
        </template>
      </Column>
      <Column field="email" header="E-Mail" sortable style="min-width: 14rem" />
      <Column field="phone" header="Phone" style="min-width: 10rem" />
      <Column field="address" header="Address" style="min-width: 14rem" />
      <Column header="Actions" style="min-width: 10rem">
        <template #body="{ data }">
          <div class="actions-cell">
            <Button
              v-if="actionLabel(data.status)"
              :label="actionLabel(data.status)"
              icon="pi pi-arrow-down"
              severity="info"
              size="small"
              @click="increaseStatus(data._id!)"
            />
            <Button
              icon="pi pi-trash"
              severity="danger"
              size="small"
              text
              @click="confirmDelete(data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { axiosDelete, axiosGet, axiosPatch } from '@/utils/axiosWrapper'
import { useNotify } from '@/composables/useNotify'
import { useConfirmAction } from '@/composables/useConfirmAction'
import type { IDonor } from '@/types/models'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'

const notify = useNotify()
const { confirmDelete: confirmDeleteAction } = useConfirmAction()

const donors = ref<IDonor[]>([])
const globalFilter = ref('')

const statusOrder: Record<string, number> = {
  'CREATED': 0,
  'PENDING DONATION': 1,
  'PENDING CONFIRMATION': 2,
  'DONE': 3,
}

const statusLabels: Record<string, string> = {
  'CREATED': 'Created',
  'PENDING DONATION': 'Pending Donation',
  'PENDING CONFIRMATION': 'Pending Confirmation',
  'DONE': 'Archive',
}

const actionLabels: Record<string, string> = {
  'CREATED': 'E-Mail send',
  'PENDING DONATION': 'Donation received',
  'PENDING CONFIRMATION': 'Confirmation send',
}

function statusLabel(status: string): string {
  return statusLabels[status] || status
}

function actionLabel(status: string): string {
  return actionLabels[status] || ''
}

const sortedDonors = computed(() => {
  let data = [...donors.value]

  if (globalFilter.value) {
    const search = globalFilter.value.toLowerCase()
    data = data.filter(d =>
      d.firstName?.toLowerCase().includes(search) ||
      d.lastName?.toLowerCase().includes(search) ||
      d.email?.toLowerCase().includes(search) ||
      d.phone?.toLowerCase().includes(search) ||
      d.address?.toLowerCase().includes(search)
    )
  }

  data.sort((a, b) => (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99))
  return data
})

async function loadDonors() {
  try {
    const res = await axiosGet('/donor/')
    donors.value = res.data || []
  } catch (error) {
    notify.error(`Failed to load donors: ${error}`)
  }
}

function confirmDelete(donor: IDonor) {
  confirmDeleteAction(
    `Are you sure you want to delete ${donor.firstName} ${donor.lastName}?`,
    async () => {
      try {
        await axiosDelete('/donor/' + donor._id)
        notify.success('Donor deleted successfully')
        await loadDonors()
      } catch (error) {
        notify.error(`Failed to delete donor: ${error}`)
      }
    }
  )
}

async function increaseStatus(id: string) {
  try {
    await axiosPatch('/donor/status/increase', { _id: id })
    notify.success('Status updated')
    await loadDonors()
  } catch (error) {
    notify.error(`Failed to update status: ${error}`)
  }
}

onMounted(() => {
  loadDonors()
})
</script>

<style scoped>
.actions-cell {
  display: flex;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .page-header { flex-wrap: wrap; gap: 0.5rem; }
}
</style>
