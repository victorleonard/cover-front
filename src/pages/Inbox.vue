<template>
  <q-page v-if="chatrooms" class="flex column">
    <div>
      <!-- <div class="row full-width justify-center">
        <div class="col col-8 col-sm-10 col-xs-11 col-lg-8 col-xl-8 q-mt-lg q-mb-md">
          <div class="flex items-center">
          <q-icon style="font-size: 4em;" class="q-mr-sm" color="midnightBlue" name="email" />
          <h1 class="text-h4 text-grey-8">Messages</h1>
          </div>
        </div>
      </div> -->
      <div class="row full-width justify-center q-mt-md">
        <div class="col col-8 col-sm-10 col-xs-11 col-lg-8 col-xl-8">
          <q-list v-if="chatrooms.length" separator>
            <q-item class="bg-white" @click="openRoom(room)" v-for="room in chatrooms" :key="room.id" clickable v-ripple>
            <q-item-section avatar>
              <q-avatar round class="bg-grey-4" v-if="room.from.id !== profile.id">
                <img v-if="room.from.avatar" :src="room.from.avatar.url">
                <span v-else>{{ room.from.pseudo.charAt() }}</span>
              </q-avatar>
              <q-avatar v-else round class="bg-grey-4">
                <img v-if="room.to.avatar" :src="room.to.avatar.url">
                <span v-else>{{ room.to.pseudo.charAt() }}</span>
              </q-avatar>
            </q-item-section>

            <q-item-section lines="1">
                <q-item-label>
                  <span class="text-weight-bold">{{ room.from.pseudo }}</span>
                </q-item-label>
                <q-item-label>
                  <span>{{ getLastMessage(room.messages) }}</span>
                </q-item-label>
              </q-item-section>

            <q-item-section side>
              {{ formatDate(room.createdAt) }}
            </q-item-section>
          </q-item>
          <q-separator />
          </q-list>
          <q-list v-else bordered separator>
            <q-item>
              <q-item-section>
                  Aucun message
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>

import { mapState } from 'vuex'
import { date } from 'quasar'

export default {
  name: 'Inbox',
  data: () => ({
    tab: 'received',
    chatrooms: undefined
  }),
  computed: {
    ...mapState('main', ['profile'])
  },
  methods: {
    getLastMessage (messages) {
      if (messages.length) {
        return messages[messages.length - 1].content
      }
    },
    formatDate (d) {
      console.log(d)
      return date.formatDate(d, 'DD-MM-YYYY HH:mm')
    },
    openRoom (room) {
      this.$store.commit('main/SET_CURRENT_MESSAGE', room)
      this.$router.push({
        name: 'message',
        params: {
          id: room.id
        }
      })
    }
  },
  created () {
    this.$axios.get('messages/me')
      .then(res => {
        this.chatrooms = res.data
      })
  }
}
</script>
