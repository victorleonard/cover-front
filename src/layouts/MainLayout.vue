<template>
  <q-layout view="lHh Lpr lFf">
    <q-header bordered>
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
        <q-toolbar-title>
          Mes groupes
        </q-toolbar-title>
        <q-btn flat round dense icon="eva-person-outline">
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
    <q-footer bordered class="bg-white text-primary" v-if="$route.name !== 'welcome' && $route.name !== 'connect' && $route.name !== 'register' && $route.name !== 'email-confirmation' && $route.name !== 'reset-password' && $route.name !== 'forgot-password'">
        <q-tabs indicator-color="transparent">
        <q-route-tab v-if="myGroups && myGroups.length" :to="{ name: 'home' }" no-caps icon="list_alt" exact replace label="Mes Groupes"/>
        <q-route-tab :to="{ name: 'create-or-join' }" icon="add" exact replace no-caps label="Nouveau Groupe"/>
      </q-tabs>
      </q-footer>
  </q-layout>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'MainLayout',
  data () {
    return {
      leftDrawerOpen: false
    }
  },
  computed: {
    ...mapState('main', ['user', 'myGroups'])
  },
  methods: {
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
  }
}
</script>
