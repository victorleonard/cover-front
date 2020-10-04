<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal>
      <q-toolbar
        color="deep-orange-5"
      >
      <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-toolbar-title>
          {{ currentGroup.name }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
    <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Essential Links
        </q-item-label>
        <q-item
    clickable
    tag="a"
    target="_blank"
    href="link"
  >
    <q-item-section
      avatar
    >
      <q-icon name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>title</q-item-label>
      <q-item-label caption>
        caption
      </q-item-label>
    </q-item-section>
  </q-item>
      </q-list>
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
      <q-tabs inverted color="deep-orange-8" swipeable animated position="top">
        <q-route-tab :to="{ name: 'group' }" icon="home" exact replace label="Résultat"/>
        <q-route-tab :to="{ name: 'vote' }" icon="how_to_vote" exact replace label="Votez"/>
        <q-route-tab icon="search" :to="{ name: 'search' }" exact replace label="Proposez"/>
        <!-- <q-route-tab slot="title" icon="how_to_vote" :to="{name:'vote'}" label="Votez">
          <transition
            appear
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
            duration="500"
          >
            <q-chip v-if="awaitingVote && awaitingVote.length" square floating color="positive" style="right: 25%; top: 3px">{{ awaitingVote.length }}</q-chip>
          </transition>
        </q-route-tab>
        <q-route-tab slot="title" icon="search" :to="{name:'search'}" label="Proposez"/>
        <q-route-tab slot="title" icon="ion-md-calendar" :to="{name:'repet'}" label="Calendrier"/> -->
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
    ...mapState('main', ['currentGroup'])
  },
  beforeCreate () {
    console.log('====>>', this.$route.params.groupId)
    this.$store.dispatch('main/getCurrentGroup', {
      groupId: this.$route.params.groupId
    })
  }
}
</script>

<style>
</style>
