<template>
  <q-page class="flex column" v-if="currentMessage">
    <div class="row full-width justify-center q-mt-md">
        <div class="col col-8 col-sm-10 col-xs-11 col-lg-8 col-xl-8">
          <q-chat-message v-for="message in currentMessage.messages" :key="message.id"
          :sent="message.profile_id === $q.cookies.get('profile_id')"
          :text="[message.content]"
          :name="getMessageName(message)"
          :stamp="getFormatDate(message)"
      />
    </div>
  </div>
  <q-footer>
      <q-toolbar>
        <q-form @submit="sendMessage" class="full-width">
          <q-input
            ref="newMessage"
            bg-color="white"
            v-model="newMessage"
            placeholder="Message"
            class="full-width"
          >
            <template>
              <q-btn round dense flat type="submit" icon="send" color="brand" />
            </template>
          </q-input>
        </q-form>
      </q-toolbar>
    </q-footer>
  </q-page>
</template>

<script>
import io from 'socket.io-client'
// import { date } from 'quasar'
import moment from 'moment'

export default {
  name: 'Message',
  data: () => ({
    newMessage: '',
    socket: io('https://cover-mobile.herokuapp.com/'),
    currentMessage: undefined
  }),
  methods: {
    getFormatDate (message) {
      // return date.formatDate(message.created, 'YYYY-MM-DDTHH:mm:ss.SSSZ')
      return moment(message.created).lang('fr').fromNow()
    },
    getMessageName (message) {
      if (message.profile_id === this.$q.cookies.get('profile_id')) {
        return 'moi'
      } else {
        return this.currentMessage.to.pseudo
      }
    },
    getCurrentMessage () {
      this.$axios.get('/messages/me/' + this.$route.params.id)
        .then(res => {
          this.currentMessage = res.data
          this.$store.commit('main/SET_CURRENT_MESSAGE', res.data)
        })
    },
    sendMessage () {
      this.socket.emit('SEND_MESSAGE', {
        content: this.newMessage,
        profile_id: this.$q.cookies.get('profile_id')
      })
      const messages = [...this.currentMessage.messages]
      messages.push({
        content: this.newMessage,
        profile_id: this.$q.cookies.get('profile_id')
      })
      window.scrollTo(0, document.body.scrollHeight)
      this.newMessage = ''
      this.$axios.put(`messages/${this.$route.params.id}`, {
        messages: messages
      })
    }
  },
  mounted () {
    this.socket.on('MESSAGE', (data) => {
      this.currentMessage.messages.push(data)
    })
  },
  created () {
    this.getCurrentMessage()
  }
}
</script>
