<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar v-if="$route.name !== 'welcome' && $route.name !== 'connect' && $route.name !== 'register'">
        <q-btn
          v-if="user"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Cover
        </q-toolbar-title>
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
      <router-view />
    </q-page-container>
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
    ...mapState('main', ['user'])
  },
  methods: {
    logout () {
      this.$store.dispatch('main/logout')
        .then(() => {
          this.$router.push({ name: 'welcome' })
        })
    }
  }
}
</script>
