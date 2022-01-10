<template>
  <div>
    <div class="md-title">Donors</div>
    <md-table v-if="donors.filter(d => d.status === 'CREATED').length">
      <md-table-toolbar>
        <h1 class="md-title">Created</h1>
      </md-table-toolbar>
      <md-table-row>
        <md-table-head>Name</md-table-head>
        <md-table-head>E-Mail</md-table-head>
        <md-table-head>E-Mail send</md-table-head>
        <md-table-head>Delete</md-table-head>
      </md-table-row>

      <md-table-row v-for="(item, index) in donors.filter(d => d.status === 'CREATED')" v-bind:key="index">
        <md-table-cell>{{ item.firstName }} {{ item.lastName }}</md-table-cell>
        <md-table-cell>{{ item.email }}</md-table-cell>
        <md-table-cell>
          <md-button @click="increaseStatus(item._id)">
            <md-icon>arrow_downward</md-icon>
          </md-button>
        </md-table-cell>
        <md-table-cell>
          <md-button @click="deleteEntry(item._id)">
            <md-icon class="md-accent">delete</md-icon>
          </md-button>
        </md-table-cell>
      </md-table-row>
    </md-table>
    <hr v-if="donors.filter(d => d.status === 'PENDING DONATION').length"/>
    <md-table v-if="donors.filter(d => d.status === 'PENDING DONATION').length">
      <md-table-toolbar>
        <h1 class="md-title">Pending Donation</h1>
      </md-table-toolbar>
      <md-table-row>
        <md-table-head>Name</md-table-head>
        <md-table-head>E-Mail</md-table-head>
        <md-table-head>Donation received</md-table-head>
        <md-table-head>Delete</md-table-head>
      </md-table-row>

      <md-table-row v-for="(item, index) in donors.filter(d => d.status === 'PENDING DONATION')" v-bind:key="index">
        <md-table-cell>{{ item.firstName }} {{ item.lastName }}</md-table-cell>
        <md-table-cell>{{ item.email }}</md-table-cell>
        <md-table-cell>
          <md-button @click="increaseStatus(item._id)">
            <md-icon>arrow_downward</md-icon>
          </md-button>
        </md-table-cell>
        <md-table-cell>
          <md-button @click="deleteEntry(item._id)">
            <md-icon class="md-accent">delete</md-icon>
          </md-button>
        </md-table-cell>
      </md-table-row>
    </md-table>
    <hr v-if="donors.filter(d => d.status === 'PENDING CONFIRMATION').length"/>
    <md-table v-if="donors.filter(d => d.status === 'PENDING CONFIRMATION').length">
      <md-table-toolbar>
        <h1 class="md-title">Pending confirmation</h1>
      </md-table-toolbar>
      <md-table-row>
        <md-table-head>Name</md-table-head>
        <md-table-head>E-Mail</md-table-head>
        <md-table-head>Confirmation send</md-table-head>
        <md-table-head>Delete</md-table-head>
      </md-table-row>

      <md-table-row v-for="(item, index) in donors.filter(d => d.status === 'PENDING CONFIRMATION')" v-bind:key="index">
        <md-table-cell>{{ item.firstName }} {{ item.lastName }}</md-table-cell>
        <md-table-cell>{{ item.email }}</md-table-cell>
        <md-table-cell>
          <md-button @click="increaseStatus(item._id)">
            <md-icon>arrow_downward</md-icon>
          </md-button>
        </md-table-cell>
        <md-table-cell>
          <md-button @click="deleteEntry(item._id)">
            <md-icon class="md-accent">delete</md-icon>
          </md-button>
        </md-table-cell>
      </md-table-row>
    </md-table>
    <hr v-if="donors.filter(d => d.status === 'DONE').length"/>
    <md-table v-if="donors.filter(d => d.status === 'DONE').length">
      <md-table-toolbar>
        <h1 class="md-title">Archive</h1>
      </md-table-toolbar>
      <md-table-row>
        <md-table-head>Name</md-table-head>
        <md-table-head>E-Mail</md-table-head>
        <md-table-head>Delete</md-table-head>
      </md-table-row>

      <md-table-row v-for="(item, index) in donors.filter(d => d.status === 'DONE')" v-bind:key="index">
        <md-table-cell>{{ item.firstName }} {{ item.lastName }}</md-table-cell>
        <md-table-cell>{{ item.email }}</md-table-cell>
        <md-table-cell>
          <md-button @click="deleteEntry(item._id)">
            <md-icon class="md-accent">delete</md-icon>
          </md-button>
        </md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script lang="ts">
import {axiosDelete, axiosGet, axiosPatch} from '@/utils/axiosWrapper';
import Vue from 'vue';
import {IDonor} from '../../../../api/models/donor'

export default Vue.extend({
  name: 'Donors',
  data() {
    return {
      donors: [] as IDonor[]
    }
  },
  methods: {
    async loadDonors() {
      this.donors = (await axiosGet('/donor/')).data
    },
    deleteEntry: async function (id: string) {
      const deleted = await axiosDelete('/donor/' + id)
      console.log(deleted)
      await this.loadDonors()
    },
    async increaseStatus(id: string) {
      await axiosPatch('/donor/status/increase', {_id: id})
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