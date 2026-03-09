<template>
  <div>
    <div class="md-title">Donors</div>

    <template v-for="section in sections" :key="section.status">
      <template v-if="filteredDonors(section.status).length">
        <hr v-if="section.status !== 'CREATED'" />
        <table class="md-table">
          <thead>
            <tr>
              <th colspan="6" style="text-align: left;">
                <h1 class="md-title">{{ section.label }}</h1>
              </th>
            </tr>
            <tr>
              <th>Name</th>
              <th>E-Mail</th>
              <th>Phone</th>
              <th>Address</th>
              <th v-if="section.actionLabel">{{ section.actionLabel }}</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filteredDonors(section.status)" :key="index">
              <td>{{ item.firstName }} {{ item.lastName }}</td>
              <td>{{ item.email }}</td>
              <td>{{ item.phone }}</td>
              <td>{{ item.address }}</td>
              <td v-if="section.actionLabel">
                <button class="md-button" @click="increaseStatus(item._id!)">
                  <span class="md-icon">arrow_downward</span>
                </button>
              </td>
              <td>
                <button class="md-button" @click="deleteEntry(item._id!)">
                  <span class="md-icon md-accent">delete</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import { axiosDelete, axiosGet, axiosPatch } from '@/utils/axiosWrapper';
import { defineComponent } from 'vue';
import type { IDonor } from '@/types/models';

export default defineComponent({
  name: 'Donors',
  data() {
    return {
      donors: [] as IDonor[],
      sections: [
        { status: 'CREATED', label: 'Created', actionLabel: 'E-Mail send' },
        { status: 'PENDING DONATION', label: 'Pending Donation', actionLabel: 'Donation received' },
        { status: 'PENDING CONFIRMATION', label: 'Pending Confirmation', actionLabel: 'Confirmation send' },
        { status: 'DONE', label: 'Archive', actionLabel: '' },
      ]
    }
  },
  methods: {
    filteredDonors(status: string): IDonor[] {
      return this.donors.filter(d => d.status === status)
    },
    async loadDonors() {
      this.donors = (await axiosGet('/donor/')).data
    },
    deleteEntry: async function (id: string) {
      const deleted = await axiosDelete('/donor/' + id)
      console.log(deleted)
      await this.loadDonors()
    },
    async increaseStatus(id: string) {
      await axiosPatch('/donor/status/increase', { _id: id })
      await this.loadDonors()
    }
  },
  async mounted() {
    await this.loadDonors()
  }
});
</script>
<style lang="scss">

</style>
