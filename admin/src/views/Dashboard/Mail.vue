<template>
  <mailer
      :emails="emailList"
      :server-address="sever_address"
      website-name="tumaini.be"
      info-text=""
      default-from="contact@tumaini"/>
</template>
<script lang="ts">
import Mailer from '@/components/Mailer'
import Vue from 'vue';
import {axiosGet} from "@/utils/axiosWrapper";

export default Vue.extend({
  data() {
    return {
      emailList: [],
      sever_address: '/mail/'
    }
  },
  methods: {
    getMails: function () {
      return axiosGet('/donor/emails')
          .then(function (response) {
            return response.data
          })
          .catch(function (error) {
            console.log(error);
          });
    },
  },
  async mounted() {
    this.emailList = await this.getMails()
  },
  components: {
    Mailer
  }
}
</script>
