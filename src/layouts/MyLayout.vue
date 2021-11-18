<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal>
      <q-toolbar
        class="bg-brand"
      >
      <!-- <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        /> -->
        <q-toolbar-title v-if="currentGroup">
          <q-btn v-go-back=" '/home' " flat round dense>
            <q-icon name="fas fa-caret-left" />
          </q-btn>
          <span> {{ currentGroup.name }}</span>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- <q-drawer
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

    <q-footer bordered>
      <q-tabs no-caps indicator-color="transparent" dense >
        <q-route-tab :to="{ name: 'search' }" icon="add" exact replace label="Proposer"/>
        <q-route-tab :to="{ name: 'vote' }" icon="how_to_vote" exact replace label="Voter">
          <q-badge color="red" floating transparent v-if="awaitingVote && awaitingVote.length">
            {{ awaitingVote.length }}
          </q-badge>
        </q-route-tab>
        <q-route-tab  :to="{ name: 'group' }" icon="fas fa-star-half-alt " exact replace label="Résultats"/>
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
import { QHeader, QFooter, QTabs, QRouteTab } from 'quasar'
import { mapState } from 'vuex'

export default {
  components: { QHeader, QFooter, QTabs, QRouteTab },
  name: 'MyLayout',
  /* watch: {
    '$route' (to, from) {
      this.$store.dispatch('main/getCurrentGroupSongs', {
        groupId: this.$route.params.groupId
      })
    }
  }, */
  data () {
    return {
      profiles: undefined,
      currentGroupSongs: undefined,
      currentGroup: undefined,
      leftDrawerOpen: false
    }
  },
  computed: {
    ...mapState('main', ['user', 'currentGroupProfile', 'version']),
    awaitingVote () {
      const userId = this.$q.cookies.get('user_id')
      if (this.profiles && this.currentGroupSongs) {
        const wait = this.currentGroupSongs.filter(el => el.votes &&
          el.votes.length !== this.profiles.length &&
          !el.votes.find(v => v.user === userId))
        return wait
      } else {
        return undefined
      }
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('main/logout')
        .then(() => {
          this.$router.push({ name: 'home' })
        })
    }
  },
  mounted () {
    this.$axios.get(`/profiles?groups.id=${this.$route.params.groupId}`)
      .then(r => {
        this.profiles = r.data
      })
    this.$store.dispatch('main/getCurrentGroupSongs', {
      groupId: this.$route.params.groupId
    })
      .then(r => {
        this.$store.dispatch('main/changeLoadingState', false)
        this.currentGroupSongs = r.data
      })
  },
  beforeCreate () {
    this.$store.dispatch('main/changeLoadingState', true)
    this.$store.dispatch('main/resetCurrentGroup')
      .then(() => {
        this.$store.dispatch('main/getCurrentGroup', {
          groupId: this.$route.params.groupId
        })
          .then((r) => {
            this.currentGroup = r.data
            this.$store.dispatch('main/changeLoadingState', false)
          })
      })
    // this.$store.dispatch('main/getMe')
    // this.$store.dispatch('main/getMyProfile')
  }
}
</script>
