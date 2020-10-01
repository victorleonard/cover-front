<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>

import { mapState } from 'vuex'
import { Loading } from 'quasar'

export default {
  name: 'App',
  computed: mapState('main', ['loading', 'user']),
  watch: {
    loading: function (val) {
      if (val) {
        Loading.show()
      } else {
        Loading.hide()
      }
    }
  }
}
</script>
