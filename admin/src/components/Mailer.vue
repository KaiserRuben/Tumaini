<template>
  <div class="mailer">
    <h2 class="section-title">Compose Email</h2>
    <div class="mail-form">
      <div class="field">
        <label>
          <ToggleSwitch v-model="sendToAll" />
          <span>This is an E-Mail to all {{ emails.length }} donors.</span>
        </label>
      </div>

      <div class="field" v-if="!sendToAll && (emails.includes(toMail) || toMail === '')">
        <label for="email">Select an E-Mail-Address for the receiver.</label>
        <Select id="email" v-model="toMail" :options="emailOptions"
                optionLabel="label" optionValue="value" placeholder="Select email" />
      </div>

      <div class="field" v-if="!sendToAll">
        <label>Enter the receiver.</label>
        <InputText v-model="toMail" type="text" />
      </div>

      <div class="field">
        <label>Who is the sender? (must end with @{{ websiteName }})</label>
        <InputText v-model="fromMail" type="text" />
      </div>

      <div class="field">
        <label>What is the subject?</label>
        <InputText v-model="subject" />
      </div>

      <div class="field">
        <label>What is your message?</label>
        <Textarea v-model="message" rows="6" />
      </div>

      <span v-if="infoText">{{ infoText }}</span>

      <ProgressBar v-if="progress >= 0" :value="(progress / progressMax) * 100" style="height: 20px" />

      <div class="form-actions">
        <Button label="Clear" severity="secondary" @click="clearAll()" />
        <Button label="Send" @click="sendMail()" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { axiosPost } from '@/utils/axiosWrapper';
import { defineComponent } from 'vue';
import { useNotify } from '@/composables/useNotify';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Select from 'primevue/select';
import Button from 'primevue/button';
import ToggleSwitch from 'primevue/toggleswitch';
import ProgressBar from 'primevue/progressbar';

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
  components: { InputText, Textarea, Select, Button, ToggleSwitch, ProgressBar },
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
  setup() {
    const notify = useNotify();
    return { notify };
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
  computed: {
    emailOptions(): { label: string; value: string }[] {
      const options = this.emails.map(u => ({ label: u, value: u }));
      options.push({ label: 'Other E-Mail', value: '' });
      return options;
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
        this.notify.warn(this.fromMail + ' is not a valid E-Mail.');
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
      this.notify.success('E-Mails sent.');
    }
  },
  mounted() {
    this.fromMail = this.defaultFrom ?? ""
  }
});
</script>

<style scoped>
.section-title {
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: 1.35rem;
  font-weight: 400;
  margin: 0 0 1rem;
  color: var(--t-text);
}

.mail-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
</style>
