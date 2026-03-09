<template>
  <div>
    <div class="md-card-header">
      <div class="md-title">E-Mail</div>
    </div>

    <div class="md-card-content">
      <label class="md-switch">
        <input type="checkbox" v-model="sendToAll"/>
        This is an E-Mail to all {{ emails.length }} donors.
      </label>

      <div class="md-field" v-if="!sendToAll && (emails.includes(toMail) || toMail === '')">
        <label for="email">Select an E-Mail-Address for the receiver.</label>
        <select v-model="toMail" name="toMail" id="email" class="md-select">
          <option v-for="(u, key) in emails" :value="u" :key="key">{{ u }}</option>
          <option :value="''">Other E-Mail</option>
        </select>
      </div>

      <div class="md-field" v-if="!sendToAll">
        <label>Enter the receiver.</label>
        <input v-model="toMail" type="text"/>
      </div>

      <div class="md-field">
        <label>Who is the sender? (must end with @{{ websiteName }})</label>
        <input v-model="fromMail" type="text"/>
      </div>

      <div class="md-field">
        <label>What is the subject?</label>
        <textarea v-model="subject"></textarea>
      </div>

      <div class="md-field">
        <label>What is your message?</label>
        <textarea v-model="message"></textarea>
      </div>
      {{ infoText }}
      <div v-if="progress >= 0" class="md-progress-bar">
        <div class="md-progress-bar-fill" :style="{ width: (progress / progressMax) * 100 + '%' }"></div>
      </div>
    </div>

    <div class="md-card-actions">
      <button class="md-button" @click="clearAll()">Clear</button>
      <button class="md-button md-primary" @click="sendMail()">Send</button>
    </div>
  </div>
</template>

<script lang="ts">
import { axiosPost } from '@/utils/axiosWrapper';
import { defineComponent } from 'vue';

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

export default defineComponent({
  name: 'E-Mail',
  props: {
    emails: {
      type: Array as () => string[],
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
      this.fromMail = this.defaultFrom ?? ""
      this.subject = ""
      this.message = ""
      this.mailArray = []
    },
    sendMail: function () {
      if (!validEmail(this.fromMail)) {
        alert(this.fromMail + ' is not an E-Mail.')
        return
      }
      if (!this.sendToAll) {
        if (!validEmail(this.toMail)) {
          console.warn(this.toMail + ' is not an E-Mail.')
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
        this.emails.forEach((u: string) => {
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
        axiosPost(this.serverAddress ?? '', m)
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
    this.fromMail = this.defaultFrom ?? ""
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
