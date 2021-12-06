<template>
  <q-layout view="lHh Lpr lFf">
    <q-dialog v-model="newMessage.dialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">A qui ?</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <search-user @city_selected="selectCity" />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <p>Votre message :</p>
          <q-input
            v-model="newMessage.message"
            filled
            type="textarea"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Annuler" no-caps color="grey-8" v-close-popup />
          <q-btn @click="sendMessage" unelevated no-caps icon="far fa-paper-plane" color="brand" label="Envoyer" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-header bordered reveal>
      <q-toolbar class="text-grey-9"  v-if="$route.name !== 'welcome' && $route.name !== 'connect' && $route.name !== 'register' && $route.name !== 'email-confirmation' && $route.name !== 'reset-password' && $route.name !== 'forgot-password'">
        <!-- <q-btn
          v-if="user"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
 -->
        <q-toolbar-title class="flex">
          <q-img style="max-width: 100px" v-if="$route.name === 'home'" src="~assets/cover_logo_inline.png"/>
          <q-btn v-else v-go-back="$route.name === 'message' ? '/inbox' : '/home' " flat round dense>
            <q-icon name="fas fa-chevron-left" color="grey-7" />
          </q-btn>
          <q-avatar v-if="$route.name === 'message' && currentMessageAvatar">
            <img :src="currentMessageAvatar">
          </q-avatar>
          <span v-if="$route.name === 'message'">{{ currentMessageTitle }}</span>
          <div style="margin: 0 auto">
            <span v-if="$route.name === 'profile'">Mon Profile</span>
            <span v-else-if="$route.name === 'group-creation'">Nouveau groupe</span>
            <span v-else-if="$route.name === 'group-join'">Groupes</span>
            <span v-else-if="$route.name === 'group-edit'">Edition</span>
            <span v-else></span>
          </div>
        </q-toolbar-title>
        <div v-if="$route.name !== 'message'">
        <q-btn to="/inbox" dense flat icon="eva-email-outline" class="q-mr-md">
            <!-- <q-badge color="red" floating>1</q-badge> -->
        </q-btn>
        <q-btn @click="newMessage.dialog = true" dense flat icon="fas fa-feather-alt" class="q-mr-md">
        </q-btn>
        <q-btn flat round dense>
          <q-avatar>
            <img v-if="profile && profile.avatar && profile.avatar.url" :src="profile.avatar.url">
            <q-icon v-else name="eva-person-outline" />
          </q-avatar>
          <q-menu>
          <q-list style="min-width: 150px">
            <q-item clickable v-close-popup :to="{ name: 'profile' }">
              <q-item-section>Mon compte</q-item-section>
            </q-item>
            <q-separator />
            <q-item @click="refresh" clickable v-close-popup>
              <q-item-section>Actualiser</q-item-section>
            </q-item>
            <q-separator />
             <q-item @click="logout" clickable v-close-popup>
              <q-item-section>Se déconnecter</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
        </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <!-- <q-drawer
        v-if="user"
        v-model="leftDrawerOpen"
        show-if-above
        :width="200"
        :breakpoint="500"
      >
        <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
          <q-list padding class="menu-list">
            <q-item clickable v-ripple :to="{ name: 'home' }">
              <q-item-section avatar>
                <q-icon name="home" />
              </q-item-section>

              <q-item-section>
                Home
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple :to="{ name: 'profile' }">
              <q-item-section avatar>
                <q-icon name="account_circle" />
              </q-item-section>

              <q-item-section>
                Profile
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple
            @click="logout">
            <q-item-section avatar>
                <q-icon name="login" />
              </q-item-section>
              <q-item-section>
                Log out
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
        <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
          <div class="absolute-bottom bg-transparent">
            <q-avatar size="56px" class="q-mb-sm">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
            <div class="text-weight-bold">{{ user.username }}</div>
            <div>{{ user.email }}</div>
          </div>
        </q-img>
      </q-drawer> -->

    <q-page-container>
      <transition
        mode="out-in"
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
        duration="200"
      >
        <router-view />
      </transition>
    </q-page-container>
    <q-footer bordered class="bg-white text-primary" v-if="$route.name !== 'message' && $route.name !== 'newMessage' && $route.name !== 'welcome' && $route.name !== 'connect' && $route.name !== 'register' && $route.name !== 'email-confirmation' && $route.name !== 'reset-password' && $route.name !== 'forgot-password'">
        <q-tabs narrow-indicator no-caps class="text-grey-8" indicator-color="transparent">
        <q-route-tab active-class="text-brand" v-if="myGroups && myGroups.length" :to="{ name: 'home' }" no-caps icon="list_alt" exact replace label="Mes Groupes"/>
        <q-route-tab active-class="text-brand" :to="{ name: 'create-or-join' }" icon="add" exact replace no-caps label="Nouveau Groupe"/>
      </q-tabs>
      </q-footer>
  </q-layout>
</template>

<script>
import SearchUser from 'src/components/SearchUser.vue'
import { mapState } from 'vuex'

export default {
  name: 'MainLayout',
  components: { SearchUser },
  data () {
    return {
      newMessage: {
        dialog: false,
        message: '',
        to: ''
      },
      leftDrawerOpen: false
    }
  },
  computed: {
    ...mapState('main', ['user', 'myGroups', 'profile', 'currentMessage']),
    currentMessageTitle () {
      if (!this.currentMessage) return ''
      const profile = this.currentMessage.profiles.find(p => p.id !== this.profile.id)
      return profile.pseudo
    },
    currentMessageAvatar () {
      if (!this.currentMessage) return ''
      const profile = this.currentMessage.profiles.find(p => p.id !== this.profile.id)
      console.log(profile)
      if (!profile.avatar) return
      return profile.avatar.url
    }
  },
  methods: {
    async sendMessage () {
      this.$store.dispatch('main/changeLoadingState', true)
      const room = await this.$axios.get(`rooms?profiles.id=${this.profile.id}&profiles.id=${this.newMessage.to.id}`)
      if (room) {
        if (room.data.profiles.length === '2') {
          console.log('find conversation')
          const messages = [...room.data.messages]
          messages.push({
            content: this.newMessage.message,
            profile_id: this.profile.id,
            created: new Date()
          })
          this.newMessage = {
            dialog: false,
            message: '',
            to: ''
          }
          this.$store.dispatch('main/getMyProfile')
          this.$store.dispatch('main/changeLoadingState', false)
          this.$q.notify({
            type: 'positive',
            message: 'Le message a été ajouté à la conversation existante.',
            position: 'top'
          })
        } else {
          console.log('find group chat room')
        }
      } else {
        this.$axios.post('rooms', {
          profiles: [this.profile.id, this.newMessage.to.id],
          messages: [{
            content: this.newMessage.message,
            profile_id: this.profile.id,
            created: new Date()
          }]
        })
          .then(() => {
            this.newMessage = {
              dialog: false,
              message: '',
              to: ''
            }
            this.$store.dispatch('main/getMyProfile')
            this.$store.dispatch('main/changeLoadingState', false)
            this.$q.notify({
              type: 'positive',
              message: 'Le message a été envoyé.',
              position: 'top'
            })
          })
          .catch(() => {
            this.$store.dispatch('main/changeLoadingState', false)
            this.$q.notify({
              type: 'negative',
              message: 'Server error',
              position: 'top'
            })
          })
      }
    },
    selectCity (e) {
      this.newMessage.to = e
    },
    refresh () {
      location.reload(true)
      console.log('refresh')
    },
    logout () {
      this.$store.dispatch('main/logout')
        .then(() => {
          this.$q.cookies.remove('token')
          this.$q.cookies.remove('user_id')
          this.$q.cookies.remove('profile_id')
          this.$router.push({ name: 'welcome' })
        })
    }
  },
  beforeCreate () {
    this.$store.dispatch('main/getMe')
    this.$store.dispatch('main/getMyProfile')
  }
}
</script>
