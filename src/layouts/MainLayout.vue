<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-deep-orange-5" v-if="$route.name !== 'welcome' && $route.name !== 'connect' && $route.name !== 'register' && $route.name !== 'email-confirmation' && $route.name !== 'reset-password' && $route.name !== 'forgot-password'">
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
        <q-btn @click="logout" flat round dense icon="fas fa-power-off">
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
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
      </q-drawer>

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
        <q-tabs indicator-color="transparent" dense>
        <q-route-tab v-if="myGroups && myGroups.length" :to="{ name: 'home' }" no-caps icon="list_alt" exact replace label="Mes Groupes"/>
        <q-route-tab :to="{ name: 'create-or-join' }" icon="add" exact replace no-caps label="Nouveau Groupe"/>
        <q-route-tab :to="{ name: 'profile' }" icon="account_circle" exact replace no-caps label="Profile"/>
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
    logout () {
      this.$store.dispatch('main/logout')
        .then(() => {
          this.$router.push({ name: 'welcome' })
        })
    }
  },
  beforeCreate () {
    // this.$store.dispatch('main/getMe')
  }
}
</script>
