<template>
  <div id="q-app">
    <!-- <q-dialog class="q-pa-md q-gutter-sm" v-model="dialog" minimized position="top">
      <q-card>
        <q-card-section class="row items-center no-wrap">
          <div>
            <div class="text-weight-bold">Titre</div>
            <div class="text-grey">Erreur</div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog> -->
    <router-view />
  </div>
</template>
<script>

import { mapState } from 'vuex'
import { Loading } from 'quasar'

export default {
  name: 'App',
  data: () => ({
    dialog: true
  }),
  computed: mapState('main', ['loading', 'user', 'error']),
  watch: {
    error: (val) => {
      if (val.type === true) {
        this.dialog = true
      }
    },
    loading: function (val) {
      console.log('loading', val)
      if (val) {
        Loading.show()
      } else {
        Loading.hide()
      }
    }
  },
  beforeCreate () {
    this.$store.dispatch('main/getMe')
    this.$store.dispatch('main/getMyProfile')
    this.$store.dispatch('main/changeLoadingState', false)
  }
}
</script>
