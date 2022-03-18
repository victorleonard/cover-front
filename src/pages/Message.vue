<template>
  <q-page class="flex column" v-if="currentMessage">
    <div class="row full-width justify-center q-mt-md q-mb-xl">
        <div class="col col-8 col-sm-10 col-xs-11 col-lg-8 col-xl-8">
          <q-chat-message v-for="message in currentMessage.messages" :key="message.id"
          :sent="isSent(message)"
          :text="[message.content]"
          :name="getMessageName(message)"
          :stamp="getFormatDate(message)"
          :data-open="message.open"
          :data-id="message.id"
          :data-profile="message.profile_id"
          :bg-color="isSent(message) ? 'blue-2' : 'grey-7'"
          :text-color="isSent(message) ? 'grey-9' : 'white'"
          v-intersection="onIntersection"
        />
        <q-chat-message
        v-if="is_typing"
        bg-color="grey-7"
        text-color="white"
      >
        <q-spinner-dots size="2rem" />
      </q-chat-message>
      </div>
    </div>
  <q-footer id="footer">
      <q-toolbar class="q-pb-lg">
        <q-form @submit="sendMessage" class="full-width">
          <q-input
            borderless
            ref="newMessage"
            bg-color="white"
            color="brand"
            v-model="newMessage"
            placeholder="Message"
            class="full-width"
            @input="typing"
          >
            <template>
              <q-btn dense size="lg" flat type="submit" icon="send" color="brand" />
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
import { scroll } from 'quasar'
const { getScrollTarget, setScrollPosition } = scroll

export default {
  name: 'Message',
  data: () => ({
    is_typing: false,
    newMessage: '',
    // socket: io('https://cover-mobile.herokuapp.com/'),
    socket: io('http://localhost:1337/'),
    currentMessage: undefined
  }),
  computed: {
    profile_id () {
      return this.$q.cookies.get('profile_id') || this.$q.localStorage.getItem('profile_id')
    }
  },
  methods: {
    onIntersection (entry) {
      const isOpen = entry.target.dataset.open
      const profileId = entry.target.dataset.profile
      const id = parseInt(entry.target.dataset.id)
      if (!isOpen && this.$q.cookies.get('profile_id') !== profileId) {
        const messages = [...this.currentMessage.messages]
        const messageToChange = messages.find(el => el.id === id)
        if (messageToChange) {
          messageToChange.open = true
          this.$axios.put(`chatrooms/${this.$route.params.id}`, {
            data: {
              messages: messages
            }
          })
            .then(() => {
              this.$store.dispatch('main/getMessageToRead')
            })
        }
      }
    },
    typing (e) {
      if (!e) {
        this.socket.emit('IS_TYPING', {
          typing: false,
          profile_id: this.profile_id
        })
      } else {
        this.socket.emit('IS_TYPING', {
          typing: true,
          profile_id: this.profile_id
        })
      }
    },
    isSent (message) {
      return message.profile_id !== this.profile_id
    },
    getFormatDate (message) {
      if (moment(moment()).diff(message.created, 'seconds') > 100) {
        return moment(message.created).lang('fr').fromNow()
      }
      // return date.formatDate(message.created, 'YYYY-MM-DDTHH:mm:ss.SSSZ')
    },
    getMessageName (message) {
      if (message.profile_id === this.profile_id) {
        return 'moi'
      } else {
        const profile = this.currentMessage.profiles.data.find(p => p.id === message.profile_id)
        return profile.pseudo
      }
    },
    getCurrentMessage () {
      this.$axios.get('/chatrooms/' + this.$route.params.id + '?populate=messages,profiles')
        .then(res => {
          this.currentMessage = res.data.data.attributes
          /* this.$store.dispatch('main/setCurrentMessage', {
            message: { ...res.data }
          }) */
          // this.$store.commit('main/SET_CURRENT_MESSAGE', { ...res.data })
          setTimeout(() => {
            // this.scrollToBottom()
          }, 1000)
        })
    },
    scrollToBottom () {
      const target = getScrollTarget(document.querySelector('#footer'))
      const offset = 1000
      const duration = 500
      setScrollPosition(target, offset, duration)
    },
    sendMessage () {
      this.socket.emit('SEND_MESSAGE', {
        content: this.newMessage,
        profile_id: this.profile_id,
        created: new Date()
      })
      this.socket.emit('IS_TYPING', {
        typing: false,
        profile_id: this.profile_id
      })
      const messages = [...this.currentMessage.messages]
      messages.push({
        content: this.newMessage,
        profile_id: this.profile_id,
        created: new Date()
      })
      this.newMessage = ''
      this.$axios.put(`chatrooms/${this.$route.params.id}`, {
        data: {
          messages: messages
        }
      })
    }
  },
  mounted () {
    this.socket.on('MESSAGE', (data) => {
      this.currentMessage.messages.push(data)
      this.scrollToBottom()
    })
    this.socket.on('TYPING', (data) => {
      if (data.typing && data.profile_id !== this.profile_id) {
        this.is_typing = true
      } else {
        this.is_typing = false
      }
    })
  },
  created () {
    this.getCurrentMessage()
  }
}
</script>
