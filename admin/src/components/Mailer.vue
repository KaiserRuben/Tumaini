<template>
  <div class="">
    <md-ripple>
      <md-card-header>
        <div class="md-title">E-Mail</div>
      </md-card-header>

      <md-card-content>
        <md-switch v-model="sendToAll"> This is an E-Mail to all {{ emails.length }} donors.
        </md-switch>

        <md-field v-if="!sendToAll && (emails.includes(toMail) || toMail === '')">
          <label for="email">Select an E-Mail-Address for the receiver.</label>
          <md-select v-model="toMail" name="toMail" id="email" md-dense>
            <md-option v-for="(u,key) in emails" :value="u" v-bind:key="key">{{ u }}
            </md-option>
            <md-option :value="null">Other E-Mail</md-option>
          </md-select>
        </md-field>

        <md-field v-if="!sendToAll">
          <label>Enter the receiver.</label>
          <md-input v-model="toMail" type="text"></md-input>
        </md-field>

        <md-field>
          <label>Who is the sender? (must end with @{{ websiteName }})</label>
          <md-input v-model="fromMail" type="text"></md-input>
        </md-field>

        <md-field>
          <label>What is the subject?</label>
          <md-textarea v-model="subject" md-autogrow></md-textarea>
        </md-field>

        <md-field>
          <label>What is your message?</label>
          <md-textarea v-model="message" md-autogrow></md-textarea>
        </md-field>
        {{ infoText }}
        <md-progress-bar v-if="progress>=0" md-mode="determinate"
                         :md-value="(progress/progressMax)*100"></md-progress-bar>
      </md-card-content>

      <md-card-actions>
        <md-button @click="clearAll()">Clear</md-button>
        <md-button class="md-primary" @click="sendMail()">Send</md-button>
      </md-card-actions>
    </md-ripple>
  </div>
</template>

<script lang="ts">
import {axiosPost} from '@/utils/axiosWrapper';
import Vue from 'vue';

function validEmail(email: string) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

interface Mail {
  toMail: string;
  fromMail: string;
  subject: string;
  message: string;
}

export default Vue.extend({
  name: 'E-Mail',
  props: {
    emails: {
      type: [],
      default: () => []
    },
    serverAddress: String,
    websiteName: {
      type: String,
      default: "this website"
    },
    infoText: {
      type: String,
      default: ""
    },

    defaultFrom: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      toMail: "",
      fromMail: "",
      subject: "",
      message: "",

      sendToAll: false,

      mailArray: [] as Mail[],
      progress: -1,
      progressMax: 1
    }
  },
  methods: {
    clearAll: function () {
      this.toMail = ""
      this.fromMail = this.defaultFrom
      this.subject = ""
      this.message = ""
      this.mailArray = []

    },
    sendMail: function () {
      if (!validEmail(this.fromMail)) {
        alert(this.fromMail + 'is not an E-Mail.')
        return
      }
      if (!this.sendToAll) {
        if (!validEmail(this.toMail)) {
          console.warn(this.toMail + 'is not an E-Mail.')
        }
        this.progressMax = 2
        this.progress = 0
        this.mailArray.push({
          toMail: this.toMail,
          fromMail: this.fromMail,
          subject: this.subject,
          message: this.message.replaceAll("\n", "<br />")
        })
        this.progress++
      } else {
        this.progressMax = this.emails.length * 2
        this.progress = 0
        this.emails.forEach(u => {
          this.mailArray.push({
            toMail: u,
            fromMail: this.fromMail,
            subject: this.subject,
            message: this.message.replaceAll("\n", "<br />")
          })
          this.progress += 1
        })
      }
      this.mailArray.forEach((m, index) => {
        axiosPost(this.serverAddress, m)
            .then(() => {
              this.progress += 1

              console.log("Sending Email", index + 1, "from ", this.mailArray.length)
            })
            .catch(err => console.warn(err))
            .finally(() => {
              if (index === this.mailArray.length - 1) this.doneSending()
            })
      })
    },
    doneSending: function () {

      this.progress = -1
      this.progressMax = 1
      this.clearAll()
      console.log('E-Mails sent.')
      alert('E-Mails sent.')
    }
  },
  mounted() {
    this.fromMail = this.defaultFrom
  }
});
</script>
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
