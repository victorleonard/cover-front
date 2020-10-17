<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal>
      <q-toolbar
        class="bg-deep-orange-5"
      >
      <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-toolbar-title v-if="currentGroup">
          {{ currentGroup.name }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
        v-model="leftDrawerOpen"
        show-if-above
        :width="200"
        :breakpoint="500"
      >
        <q-scroll-area class="fit" style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
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
            :to="{ name: 'group-edit', params: { groupId: $route.params.groupId } }">
              <q-item-section avatar>
                <q-icon name="group_work" />
              </q-item-section>

              <q-item-section>
                Group Edition
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
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
        duration="200"
      >
        <router-view />
      </transition>
    </q-page-container>

    <q-footer>
      <q-tabs narrow-indicator dense inverted swipeable animated position="top">
        <q-route-tab  :to="{ name: 'group' }" icon="list" exact replace label="Résultat"/>
        <q-route-tab :to="{ name: 'vote' }" icon="how_to_vote" exact replace label="Votez"/>
        <q-route-tab :to="{ name: 'search' }" icon="search" exact replace label="Proposez"/>
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
import { QHeader, QFooter, QTabs, QRouteTab } from 'quasar'
import { mapGetters, mapState } from 'vuex'

export default {
  components: { QHeader, QFooter, QTabs, QRouteTab },
  name: 'MyLayout',
  data () {
    return {
      leftDrawerOpen: false
    }
  },
  computed: {
    ...mapGetters('main', ['awaitingVote']),
    ...mapState('main', ['user', 'currentGroup'])
  },
  methods: {
    logout () {
      this.$store.dispatch('main/logout')
        .then(() => {
          this.$router.push({ name: 'home' })
        })
    }
  },
  beforeCreate () {
    this.$store.dispatch('main/getMe')
    this.$store.dispatch('main/getMyProfile')
    console.log('====>>', this.$route.params.groupId)
    this.$store.dispatch('main/getCurrentGroup', {
      groupId: this.$route.params.groupId
    })
  }
}
</script>

<style>
</style>
